// ourin-utils.js — Compatibility shim
import axios from 'axios';

export async function fetchBuffer(url, headers = {}) {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0', ...headers }
    });
    return Buffer.from(res.data);
}

export function parseMention(text = '') {
    return [...text.matchAll(/@(\d{5,16})/g)].map(m => m[1]);
}

const MIME_EXT_MAP = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
    'video/mp4': 'mp4', 'video/3gpp': '3gp', 'audio/mpeg': 'mp3', 'audio/ogg': 'ogg',
    'application/pdf': 'pdf', 'application/zip': 'zip', 'application/vnd.android.package-archive': 'apk'
};

// استنتاج نوع الـ mimetype (بالتقريب) من امتداد اسم الملف أو من نوع بافلود بسيط.
export function getMimeType(fileOrExt = '') {
    const ext = String(fileOrExt).split('.').pop()?.toLowerCase();
    const found = Object.entries(MIME_EXT_MAP).find(([, e]) => e === ext);
    return found ? found[0] : 'application/octet-stream';
}

// استنتاج امتداد الملف من الـ mimetype.
export function getExtension(mimetype = '') {
    const base = String(mimetype).split(';')[0].trim();
    return MIME_EXT_MAP[base] || base.split('/').pop() || 'bin';
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default { fetchBuffer, parseMention, delay, getMimeType, getExtension };
