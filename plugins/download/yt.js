import crypto from 'crypto';

// ===== SaveTube - MP3 / MP4 =====
class SaveTube {
    constructor() {
        this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        this.headers = {
            'content-type': 'application/json',
            'origin': 'https://yt.savetube.me',
            'user-agent': 'Mozilla/5.0 (Android 15; Mobile)'
        };
    }

    async decrypt(enc) {
        const buf = Buffer.from(enc, 'base64');
        const key = Buffer.from(this.ky, 'hex');
        const iv = buf.slice(0, 16);
        const data = buf.slice(16);
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString());
    }

    async getCdn() {
        const res = await fetch('https://media.savetube.vip/api/random-cdn', {
            signal: AbortSignal.timeout(10000)
        });
        const d = await res.json();
        return d.cdn;
    }

    // downloadType: 'audio' | 'video'
    // quality: للصوت '128'، للفيديو '720'/'480'/'360'
    async download(url, downloadType = 'audio', quality = '128') {
        const id = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)?.[1];
        if (!id) throw new Error('لينك اليوتيوب غلط');

        const cdn = await this.getCdn();
        const infoRes = await fetch(`https://${cdn}/v2/info`, {
            method: 'POST', headers: this.headers,
            body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${id}` }),
            signal: AbortSignal.timeout(15000)
        });
        const info = await infoRes.json();
        const dec = await this.decrypt(info.data);

        const dlRes = await fetch(`https://${cdn}/download`, {
            method: 'POST', headers: this.headers,
            body: JSON.stringify({ id, downloadType, quality, key: dec.key }),
            signal: AbortSignal.timeout(20000)
        });
        const dl = await dlRes.json();
        if (!dl?.data?.downloadUrl) throw new Error('SaveTube: مفيش رابط تحميل');
        return { title: dec.title, url: dl.data.downloadUrl };
    }
}

// ===== MP4 - SaveTube أولاً (نفس طريقة الصوت الشغالة) ثم APIs احتياطية =====
async function downloadMp4(url) {
    const id = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)?.[1];
    if (!id) throw new Error('لينك اليوتيوب غلط');

    // API 1: SaveTube (نفس مكتبة الصوت الشغالة) - بنجرب جودات مختلفة
    const st = new SaveTube();
    for (const quality of ['720', '480', '360']) {
        try {
            const res = await st.download(url, 'video', quality);
            if (res?.url) return res;
        } catch {}
    }

    // API 2: y2mate
    try {
        const res1 = await fetch('https://www.y2mate.com/mates/analyzeV2/ajax', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `k_query=https://www.youtube.com/watch?v=${id}&k_page=home&hl=en&q_auto=0`,
            signal: AbortSignal.timeout(15000)
        });
        const d1 = await res1.json();
        const links = d1?.links?.mp4;
        const best = links?.['720p'] || links?.['480p'] || links?.['360p'];
        if (best?.k) {
            const res2 = await fetch('https://www.y2mate.com/mates/convertV2/index', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `vid=${id}&k=${best.k}`,
                signal: AbortSignal.timeout(20000)
            });
            const d2 = await res2.json();
            if (d2?.dlink) return { url: d2.dlink, title: d1.title || 'YouTube Video' };
        }
    } catch {}

    // API 3: cobalt instances
    const cobaltAPIs = [
        'https://cobalt.api.timelessnesses.me',
        'https://api.cobalt.tools',
        'https://cobalt.ggtyler.dev',
    ];
    for (const api of cobaltAPIs) {
        try {
            const res = await fetch(`${api}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ url, videoQuality: '720', filenameStyle: 'basic' }),
                signal: AbortSignal.timeout(15000)
            });
            const data = await res.json();
            if (data?.url) return { url: data.url, title: 'YouTube Video' };
            if (data?.tunnel) return { url: data.tunnel, title: 'YouTube Video' };
        } catch {}
    }

    // API 4: yt-dlp wrapper (emam-api)
    try {
        const res = await fetch(
            `https://emam-api.web.id/home/sections/Download/api/YouTube/download?url=${encodeURIComponent(url)}&quality=720p`,
            { signal: AbortSignal.timeout(20000) }
        );
        const data = await res.json();
        if (data?.data?.url) return { url: data.data.url, title: data.data.title || 'YouTube Video' };
    } catch {}

    throw new Error('كل الـ APIs ضربوا، جرب بعدين');
}

const handler = async (m, { conn, command, text }) => {
    if (!text) return m.reply('*❲ ❤️ ❳ ~ حط رابط يوتيوب جنب الامر*');
    if (!text.match(/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//)) {
        return m.reply('*❌ الرابط مش صح*');
    }

    const isAudio = command === 'يوت_اغنيه' || command === 'ytmp3';
    m.react('⏳');

    try {
        if (isAudio) {
            const st = new SaveTube();
            const res = await st.download(text, 'audio', '128');
            const fileRes = await fetch(res.url, { signal: AbortSignal.timeout(60000) });
            const buffer = Buffer.from(await fileRes.arrayBuffer());
            await conn.sendMessage(m.chat, {
                audio: buffer, mimetype: 'audio/mpeg', fileName: `${res.title}.mp3`
            }, { quoted: m });
        } else {
            const res = await downloadMp4(text);
            const fileRes = await fetch(res.url, { signal: AbortSignal.timeout(90000) });
            const buffer = Buffer.from(await fileRes.arrayBuffer());
            await conn.sendMessage(m.chat, {
                video: buffer,
                caption: `🎬 *${res.title}*`,
                mimetype: 'video/mp4'
            }, { quoted: m });
        }
        m.react('✅');
    } catch (e) {
        m.react('❌');
        await m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['يوتيوب', 'يوت_اغنيه'];
handler.category = 'download';
handler.command = ['يوت_اغنيه', 'يوتيوب', 'ytmp3', 'ytmp4'];
export default handler;
