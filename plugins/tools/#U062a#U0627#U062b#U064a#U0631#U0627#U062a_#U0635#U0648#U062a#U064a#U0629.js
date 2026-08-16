import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import os from 'os';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const FILTERS = {
    'صوت_عميق':  'equalizer=f=94:width_type=o:width=2:g=30',
    'صوت_رفيع':  'atempo=1.06,asetrate=44100*1.25',
    'صوت_سريع':  'atempo=1.63,asetrate=44100',
    'صوت_بطيء':  'atempo=0.7,asetrate=44100',
    'صوت_تخين':  'atempo=4/4,asetrate=44500*2/3',
    'صوت_روبوت': "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75",
    'صوت_صاخب':  'volume=8'
};

const runFilter = (inputPath, outputPath, filter) => new Promise((resolve, reject) => {
    ffmpeg(inputPath)
        .audioFilters(filter)
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
});

const handler = async (m, { conn, command }) => {
    const filter = FILTERS[command];
    if (!filter) return;

    const q = m.quoted ? m.quoted : m;
    const mime = (q.mimetype || m.msg?.mimetype || '');
    if (!/audio/.test(mime)) {
        return m.reply(`*⚠️ رد على مقطع صوتي أو ملاحظة صوتية بالأمر ده*\n> مثال: رد على صوت واكتب \`${command}\``);
    }

    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `in-${Date.now()}.mp3`);
    const outputPath = path.join(tmpDir, `out-${Date.now()}.mp3`);

    try {
        const buffer = await q.download();
        fs.writeFileSync(inputPath, buffer);

        await runFilter(inputPath, outputPath, filter);

        const result = fs.readFileSync(outputPath);
        await conn.sendMessage(m.chat, { audio: result, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
    } catch {
        return m.reply('*❌ حصلت مشكلة وأنا بعدل الصوت، جرب تاني*');
    } finally {
        try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch {}
        try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch {}
    }
};

handler.usage    = Object.keys(FILTERS);
handler.category = 'tools';
handler.command  = Object.keys(FILTERS);
handler.cooldown = 3000;

export default handler;
