// ════════════════════════════════════════
//  ourin-bratvid.js — Compatibility shim
//  بديل محلي لباكدج 'brat-canvas/video' غير المنشورة. بيرسم فريم واحد
//  بستايل "brat" (نص على خلفية خضراء ليموني) باستخدام skia-canvas
//  المتاحة أصلاً في المشروع، وبيحوله لفيديو قصير عن طريق ffmpeg.
// ════════════════════════════════════════
import { Canvas } from 'skia-canvas';
import { queueFFmpeg } from './ourin-ffmpeg.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import os from 'os';
import path from 'path';

async function renderFrame(text) {
    const canvas = new Canvas(720, 720);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8ACE00';
    ctx.fillRect(0, 0, 720, 720);
    ctx.fillStyle = '#000000';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = text.match(/.{1,18}(\s|$)/g) || [text];
    lines.forEach((line, i) => {
        ctx.fillText(line.trim(), 360, 360 - (lines.length - 1) * 30 + i * 60);
    });
    return canvas.toBuffer('png');
}

export async function bratVid(text, options = {}) {
    return queueFFmpeg(async () => {
        const frameBuf = await renderFrame(text);
        const frameFile = path.join(os.tmpdir(), `brat-frame-${Date.now()}.png`);
        const outFile = path.join(os.tmpdir(), `brat-out-${Date.now()}.${options.outputFormat === 'mp4' ? 'mp4' : 'webp'}`);
        fs.writeFileSync(frameFile, frameBuf);

        await new Promise((resolve, reject) => {
            ffmpeg(frameFile)
                .loop(3)
                .outputOptions(['-c:v libx264', '-pix_fmt yuv420p', '-t 3'])
                .save(outFile)
                .on('end', resolve)
                .on('error', reject);
        });

        const result = fs.readFileSync(outFile);
        fs.unlinkSync(frameFile);
        fs.unlinkSync(outFile);
        return result;
    });
}

export default { bratVid };
