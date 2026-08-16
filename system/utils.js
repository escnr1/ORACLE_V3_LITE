import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import axios from "axios";
import FormData from 'form-data';
import { fileTypeFromBuffer } from "file-type";
import { Sticker } from "wa-sticker-formatter";
import cheerio from "cheerio";

const execAsync = promisify(exec);
const tmp = path.join(process.cwd(), "tmp");

if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });

/* ========== Create Sticker ======== */

const createSticker = async (buffer, options = {}) => {
  const sticker = new Sticker(buffer, {
    pack: options.pack || 'Ese',
    author: options.author || 'ES',
    type: "full",
    quality: options.mime === "image/jpg" ? 100 : 10
  });
  return sticker.build();
};

/* ========== GIF TO MP4 ========= */

async function gifToMp4(url) {
  const id = Date.now();
  const gifPath = path.join(tmp, `${id}.gif`);
  const mp4Path = path.join(tmp, `${id}.mp4`);
  
  try {
    const writer = fs.createWriteStream(gifPath);
    const res = await axios({ url, responseType: 'stream' });
    res.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // استخدم -y لاستبدال الملف ولا تطبع كل الـ output
    try {
      await execAsync(
        `ffmpeg -y -i "${gifPath}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p -loglevel error "${mp4Path}"`
      );
    } catch (e) {
      if (e.code === 127 || /not found|not recognized|ENOENT/i.test(e.message || '')) {
        throw new Error('ffmpeg مش متثبت على السيرفر. على Termux شغّل: pkg install ffmpeg -y');
      }
      throw e;
    }
    
    const buffer = fs.readFileSync(mp4Path);
    return buffer;
  } finally {
    if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
    if (fs.existsSync(mp4Path)) fs.unlinkSync(mp4Path);
  }
}

/* ========== Anime GIF API ========= */

async function AnimeGif(type) {
  // User-Agent شكله متصفح عادي - مش بوت - عشان Cloudflare مايرفضش
  // طلبات جايه من سيرفرات استضافة (IP داتا سنتر بيتحظر أسهل من نت الموبايل)
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  };

  const apis = [
    async () => {
      const res = await axios.get(`https://nekos.best/api/v2/${type}`, { timeout: 15000, headers });
      const item = res.data?.results?.[0];
      if (!item?.url) throw new Error('no url in response');
      return { url: item.url, anime_name: item.anime_name || 'أنمي' };
    },
    async () => {
      const res = await axios.get(`https://api.waifu.pics/sfw/${type}`, { timeout: 15000, headers });
      if (!res.data?.url) throw new Error('no url in response');
      return { url: res.data.url, anime_name: 'أنمي' };
    },
    async () => {
      const res = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${type}`, { timeout: 15000, headers });
      if (!res.data?.url) throw new Error('no url in response');
      return { url: res.data.url, anime_name: 'أنمي' };
    }
  ];

  const errors = [];
  for (const api of apis) {
    try {
      return await api();
    } catch (e) {
      const reason = e.response
        ? `HTTP ${e.response.status}`
        : e.code || e.message || 'unknown error';
      errors.push(reason);
    }
  }

  console.error(`[AnimeGif] "${type}" ما جبتوش من كل المصادر:`, errors.join(' | '));
  throw new Error(`جلب GIF من النوع ${type} مضربش (${errors.join(' | ')})`);
}

/* =========== CatBox =========== */

async function uploadToCatbox(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime });

  const { data } = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
  if (!data?.includes('catbox')) throw new Error('upload failed');
  return data.trim();
}

/* =========== AI =========== */

async function AiChat(options = {}) {
  const url = `https://text.pollinations.ai/${options.text}?model=${options.model || "openai"}`;
  return (await fetch(url)).text();
}

/* =========== Qu.ax Upload =========== */

const extractFromHtml = (html, baseUrl) => {
  const $ = cheerio.load(html);
  const selectors = [
    'meta[property="og:image"]', 'meta[property="og:video"]', 'meta[property="og:audio"]',
    'meta[name="twitter:image"]', 'meta[name="twitter:player"]', 'meta[name="twitter:video"]',
    'link[rel="image_src"]', 'link[rel="video_src"]', 'video source', 'audio source', 'img'
  ];
  
  for (const selector of selectors) {
    let url = $(selector).attr('content') || $(selector).attr('src') || $(selector).attr('href');
    if (url && !url.includes('base64') && !url.startsWith('data:')) {
      if (!url.startsWith('http')) {
        try { url = new URL(url, baseUrl).href; } catch(e) { continue; }
      }
      if (url.match(/\.(jpg|jpeg|png|gif|webp|mp4|mkv|webm|mov|mp3|wav|ogg|m4a|flac)(\?|$)/i)) return url;
    }
  }
  return null;
};

const uploadToQuax = async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('files[]', buffer, { filename: `tmp.${ext}`, contentType: mime });
  const { data } = await axios.post('https://qu.ax/upload.php', form, { headers: form.getHeaders() });
  
  let mediaUrl = typeof data === 'string' ? extractFromHtml(data, 'https://qu.ax') : data.files?.[0]?.url;
  if (!mediaUrl) throw new Error('Upload failed');
  if (mediaUrl.includes('/x/')) return mediaUrl;
  
  const { data: pageHtml } = await axios.get(mediaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  return extractFromHtml(pageHtml, mediaUrl) || mediaUrl;
};


/* =========== Termai.cc Upload =========== */

async function uploadTmpfiles(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append('file', buffer, { filename: `file.${ext}`, contentType: mime });

    const res = await axios.post("https://c.termai.cc/api/upload?key=AIzaBj7z2z3xBjsk", form, {
        headers: form.getHeaders(),
        timeout: 30000
    });

    if (!res.data?.status || !res.data?.path) throw new Error("Upload failed: " + JSON.stringify(res.data));
    return res.data.path;
}

export { 
  uploadToCatbox, 
  uploadToQuax, 
  uploadTmpfiles, 
  createSticker, 
  AiChat, 
  gifToMp4,
  AnimeGif
};