/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.includes('video') && !mime.includes('gif')) {
        return m.reply('*❌ رد على فيديو أو GIF عشان أحوله لملصق متحرك*');
    }

    const مدة = (q.msg || q).seconds || 0;
    if (مدة > 10) return m.reply('*❌ الفيديو لازم يكون أقل من 10 ثواني*');

    m.react('⏳');
    try {
        const buffer = await q.download();

        const sticker = await new Sticker(buffer, {
            pack: '𝐎𝐑𝐀𝐂𝐋𝐄',
            author: 'ORACLE',
            type: 'full',
            quality: 50
        }).toBuffer();

        await conn.sendMessage(m.chat, { sticker }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحويل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ملصق_متحرك'];
handler.command = ['ملصق_متحرك', 'gifsticker', 'gif_sticker', 'ملصق-متحرك'];
handler.category = 'sticker';

export default handler;
