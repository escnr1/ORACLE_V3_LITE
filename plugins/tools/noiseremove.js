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

async function إزالة_ضوضاء(buffer) {
    const base64 = buffer.toString('base64');

    const res = await axios.post(
        'https://api.deepai.org/api/speech-noise-removal',
        { audio: `data:audio/mpeg;base64,${base64}` },
        {
            headers: {
                'Api-Key': 'quickstart-QUdJIGlzIGF3ZXNvbWU',
                'Content-Type': 'application/json'
            },
            timeout: 120000
        }
    );

    const رابط = res.data?.output_url;
    if (!رابط) throw new Error('مرجعش نتيجة من السيرفر');

    const صوت = await axios.get(رابط, { responseType: 'arraybuffer', timeout: 60000 });
    return Buffer.from(صوت.data);
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.includes('audio') && !mime.includes('video')) {
        return m.reply('*❌ رد على رسالة صوتية أو ملف صوت عشان أنظفه من الضوضاء*');
    }

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بشيل الضوضاء...*');
    try {
        const buffer = await q.download();
        const ناتج = await إزالة_ضوضاء(buffer);

        await conn.sendMessage(m.chat, {
            audio: ناتج,
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            text: '✅ *الضوضاء اتشالت من الصوت*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ العملية مضربت:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['نظف_صوت'];
handler.command = ['نظف_صوت', 'noiseremove', 'denoise'];
handler.category = 'tools';

export default handler;
