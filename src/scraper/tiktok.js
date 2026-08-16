// tiktok.js — Compatibility shim: تحميل فيديو/صوت تيك توك (btch-downloader مكتبة حقيقية)
import { ttdl } from 'btch-downloader';

export default async function ttdown(url) {
    return ttdl(url);
}
