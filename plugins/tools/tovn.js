/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

async function فيديو_لصوت(buffer, mime) {
    const مجلد = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(مجلد)) fs.mkdirSync(مجلد, { recursive: true });

    const ext = mime.includes('video') ? 'mp4' : 'mp3';
    const مدخل = path.join(مجلد, `tovn_in_${Date.now()}.${ext}`);
    const مخرج = path.join(مجلد, `tovn_out_${Date.now()}.mp3`);

    fs.writeFileSync(مدخل, buffer);

    return new Promise((resolve, reject) => {
        exec(`ffmpeg -y -i "${مدخل}" -vn -ar 44100 -ac 2 -b:a 128k "${مخرج}"`, (err) => {
            try { fs.unlinkSync(مدخل); } catch {}
            if (err) return reject(new Error('التحويل مضربش'));
            const buf = fs.readFileSync(مخرج);
            try { fs.unlinkSync(مخرج); } catch {}
            resolve(buf);
        });
    });
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.includes('video') && !mime.includes('audio')) {
        return m.reply('*❌ رد على فيديو أو صوت عشان أحوله لرسالة صوتية*');
    }

    m.react('⏳');
    try {
        const buffer = await q.download();
        const ناتج = await فيديو_لصوت(buffer, mime);

        await conn.sendMessage(m.chat, {
            audio: ناتج,
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحويل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['لرسالة_صوتية'];
handler.command = ['لرسالة_صوتية', 'tovn', 'toptt'];
handler.category = 'tools';

export default handler;
