// lufemboy.js — Compatibility shim: فحص اسم بأسلوب لعبة/فكاهي بسيط
export default function cekfemboy(nama = '') {
    let hash = 0;
    for (const c of nama) hash = (hash * 31 + c.charCodeAt(0)) % 100;
    return { nama, percent: hash };
}
