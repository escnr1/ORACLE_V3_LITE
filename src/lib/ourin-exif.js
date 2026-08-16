// ourin-exif.js — Compatibility shim (بيانات EXIF للملصقات) باستخدام node-webpmux
import webpmux from 'node-webpmux';

export const DEFAULT_METADATA = {
    packname: 'ORACLE V3',
    author: 'أوراكل'
};

export async function addExifToWebp(webpBuffer, metadata = {}) {
    const meta = { ...DEFAULT_METADATA, ...metadata };
    try {
        const img = new webpmux.Image();
        await img.load(webpBuffer);
        const exif = Buffer.from([
            0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
            0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
        ]);
        const json = { 'sticker-pack-id': 'oracle-v3', 'sticker-pack-name': meta.packname, 'sticker-pack-publisher': meta.author, emojis: ['✨'] };
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf8');
        const exifAttr = Buffer.concat([exif, jsonBuff]);
        exifAttr.writeUIntLE(jsonBuff.length, 14, 4);
        img.exif = exifAttr;
        return await img.save(null);
    } catch {
        return webpBuffer;
    }
}

export function isAnimatedWebp(buffer) {
    try {
        return buffer.includes(Buffer.from('ANIM'));
    } catch {
        return false;
    }
}

export default { addExifToWebp, isAnimatedWebp, DEFAULT_METADATA };
