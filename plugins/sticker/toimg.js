/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

const handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('*❌ رد على ملصق عشان أحوله لصورة*');

    const q = m.quoted;
    const mime = q.mediaType || q.mimetype || '';

    if (!/webp/.test(mime)) return m.reply('*❌ رد على ملصق وليس صورة عادية*');

    m.react('⏳');
    try {
        const media = await q.download();
        await conn.sendMessage(m.chat, {
            image: media,
            caption: '> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحويل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ملصق_لصورة'];
handler.command = ['ملصق_لصورة', 'stk2img', 'ملصق-لصورة'];
handler.category = 'sticker';

export default handler;
