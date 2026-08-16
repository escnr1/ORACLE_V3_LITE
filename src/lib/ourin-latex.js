// ════════════════════════════════════════
//  ourin-latex.js — Compatibility shim
//  بيرندر معادلة LaTeX واحدة لصورة PNG عبر codecogs (خدمة عامة مجانية).
// ════════════════════════════════════════
import axios from 'axios';

export async function renderLatexToPng(latexExpression) {
    const url = `https://latex.codecogs.com/png.image?\\dpi{200}\\huge ${encodeURIComponent(latexExpression)}`;
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 });
    return Buffer.from(res.data);
}

// بيرجع دالة رفع بسيطة مربوطة بـ sock (مش لازمة فعلياً هنا لأن الصور
// بتتبعت مباشرة كـ Buffer، بس بنرجعها عشان التوافق مع توقيع الأصل)
export function createMediaUploadFn(sock) {
    return async (buffer) => buffer;
}

export default { renderLatexToPng, createMediaUploadFn };
