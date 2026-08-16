// ════════════════════════════════════════
//  src/scraper/hd.js — Compatibility shim: تحسين جودة الصور (HD/Upscale)
//  ⚠️ محتاج مراجعة: نفس نمط faa المستخدم في باقي أدوات الصور بالمشروع.
// ════════════════════════════════════════
import axios from 'axios';
import uploadImage from '../lib/ourin-uploader.js';

export async function upload(buffer) {
    const url = await uploadImage(buffer, 'image.jpg');
    const res = await axios.get('https://api-faa.my.id/faa/hd-enhance-submit', {
        params: { url }, timeout: 30000
    });
    return res.data?.id || res.data?.jobId || url;
}

export async function get(id) {
    const res = await axios.get('https://api-faa.my.id/faa/hd-enhance-result', {
        params: { id }, timeout: 40000
    });
    const resultUrl = res.data?.result || res.data?.url;
    if (!resultUrl) throw new Error('لسه النتيجة مش جاهزة');
    const imgRes = await axios.get(resultUrl, { responseType: 'arraybuffer', timeout: 40000 });
    return Buffer.from(imgRes.data);
}

export default { upload, get };
