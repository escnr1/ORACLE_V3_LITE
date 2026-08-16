// ════════════════════════════════════════
//  src/scraper/nanobanana.js — Compatibility shim
//  بيستخدم نفس API الشغال في plugins/vonr/ai/nanobanana.js (api.covenant.sbs)
//  ⚠️ يحتاج مفتاح API صالح في config.js -> APIkey.covenant
// ════════════════════════════════════════
import axios from 'axios';
import config from '../../config.js';
import uploadImage from '../lib/ourin-uploader.js';

export async function nanoBanana(buffer, prompt) {
    const imageUrl = await uploadImage(buffer, 'image.png');
    const { data } = await axios.post(
        'https://api.covenant.sbs/api/ai/gemini-image',
        { prompt, model: 'gemini-flash-edit', imageUrl },
        { headers: { 'x-api-key': config.APIkey?.covenant || '' }, timeout: 60000 }
    );
    if (!data?.status || !data?.data?.url) throw new Error('تعديل الصورة عبر nanoBanana مضربش');
    const imgRes = await axios.get(data.data.url, { responseType: 'arraybuffer', timeout: 45000 });
    return { image: Buffer.from(imgRes.data) };
}

export default nanoBanana;
