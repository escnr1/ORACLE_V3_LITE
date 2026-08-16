/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import FormData from 'form-data';

async function صوت_لنص(buffer) {
    const form = new FormData();
    form.append('audio_file', buffer, { filename: `audio_${Date.now()}.mp3`, contentType: 'audio/mpeg' });

    // رفع الملف
    const رفع = await axios.post('https://www.speech-to-text.cloud/athanis/upload', form, {
        headers: { ...form.getHeaders(), origin: 'https://www.speech-to-text.cloud', referer: 'https://www.speech-to-text.cloud/', 'user-agent': 'Mozilla/5.0' },
        timeout: 30000
    });

    const fid = رفع.data?.fid || رفع.data?.id;
    if (!fid) throw new Error('رفع الملف الصوتي مضربش');

    await new Promise(r => setTimeout(r, 3000));

    const نتيجة = await axios.get(`https://www.speech-to-text.cloud/athanis/transcribe/${fid}/yyy`, {
        headers: { origin: 'https://www.speech-to-text.cloud', referer: 'https://www.speech-to-text.cloud/', 'user-agent': 'Mozilla/5.0' },
        timeout: 60000
    });

    const نص = نتيجة.data?.text || نتيجة.data?.transcript;
    if (!نص?.trim()) throw new Error('مقدرتش أستخرج نص من الصوت');
    return نص;
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.includes('audio') && !mime.includes('video')) {
        return m.reply('*❌ رد على رسالة صوتية عشان أحولها لنص*');
    }

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بحوّل الصوت لنص...*');
    try {
        const buffer = await q.download();
        const نص = await صوت_لنص(buffer);

        await conn.sendMessage(m.chat, {
            text: `*🎙️ النص المستخرج من الصوت:*\n\n${نص}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحويل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['صوت_لنص'];
handler.command = ['صوت_لنص', 'transcribe', 'نسخ_صوت'];
handler.category = 'tools';

export default handler;
