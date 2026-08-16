// ourin-uploader.js — Compatibility shim
// بيرفع صورة على telegra.ph ويرجع رابط عام (نفس أسلوب lib-bode/uploadImage.js)
import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

export async function uploadImage(buffer, filename = 'image.jpg') {
    const type = await fileTypeFromBuffer(buffer).catch(() => null);
    const ext = type?.ext || filename.split('.').pop() || 'jpg';

    const form = new FormData();
    form.append('file', buffer, { filename: `tmp.${ext}` });

    const res = await axios.post('https://telegra.ph/upload', form, {
        headers: form.getHeaders(),
        timeout: 30000
    });

    const result = res.data;
    if (!Array.isArray(result) || result[0]?.error || !result[0]?.src) {
        throw new Error('رفع الصورة مضربش');
    }
    return 'https://telegra.ph' + result[0].src;
}

export default uploadImage;
