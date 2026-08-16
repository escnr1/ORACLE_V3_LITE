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

async function استخراج_نص(buffer) {
    const form = new FormData();
    form.append('file', buffer, { filename: 'image.jpg' });
    form.append('language', 'ara');
    form.append('isOverlayRequired', 'false');
    form.append('OCREngine', '1');

    const res = await axios.post('https://api8.ocr.space/parse/image', form, {
        headers: {
            ...form.getHeaders(),
            'Apikey': 'K89430831488957'
        },
        timeout: 45000
    });

    if (res.data.IsErroredOnProcessing) throw new Error(res.data.ErrorMessage?.join('\n'));
    const نص = res.data.ParsedResults?.[0]?.ParsedText;
    if (!نص?.trim()) throw new Error('مقدرتش أستخرج نص من الصورة');
    return نص;
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image')) return m.reply('*❌ رد على صورة تحتوي على نص عشان أستخرجه*');

    m.react('⏳');
    try {
        const buffer = await q.download();
        const نص = await استخراج_نص(buffer);

        await conn.sendMessage(m.chat, {
            text: `*📝 النص المستخرج:*\n\n${نص.trim()}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الاستخراج مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['نص_صورة'];
handler.command = ['نص_صورة', 'totext', 'استخرج_نص'];
handler.category = 'tools';

export default handler;
