// ════════════════════════════════════════
//  src/scraper/seaart.js — Compatibility shim
//  ⚠️ محتاج مراجعة يدوية: نفس نمط الـ API المستخدم في أوامر faa
//  (toghibli/tofigure) في نفس الحزمة، اتعمل عليه استنتاجاً.
// ════════════════════════════════════════
import axios from 'axios';
import uploadImage from '../lib/ourin-uploader.js';

export async function live3d(buffer, prompt) {
    const imageUrl = await uploadImage(buffer, 'image.jpg');
    const { data } = await axios.get('https://api-faa.my.id/faa/live3d', {
        params: { url: imageUrl, prompt },
        timeout: 60000
    });
    const resultUrl = data?.result || data?.url || data?.data?.url;
    if (!resultUrl) throw new Error('الخدمة ماردتش بنتيجة');
    const imgRes = await axios.get(resultUrl, { responseType: 'arraybuffer', timeout: 45000 });
    return { image: Buffer.from(imgRes.data) };
}

export default { live3d };
