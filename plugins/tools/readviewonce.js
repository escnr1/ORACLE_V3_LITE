/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

const handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('*❌ رد على رسالة مؤقتة (مرة واحدة)*');

    const q = m.quoted;
    const mime = q.mimetype || q.mediaType || '';

    const أنواع_مدعومة = ['image', 'video', 'audio'];
    const نوع = أنواع_مدعومة.find(t => mime.includes(t));

    if (!نوع) return m.reply('*❌ الرسالة دي مش رسالة مؤقتة*');

    m.react('⏳');
    try {
        const buffer = await q.download();

        if (نوع === 'image') {
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: '👁️ *رسالة مؤقتة*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
            }, { quoted: m });
        } else if (نوع === 'video') {
            await conn.sendMessage(m.chat, {
                video: buffer,
                caption: '👁️ *رسالة مؤقتة*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*',
                mimetype: 'video/mp4'
            }, { quoted: m });
        } else if (نوع === 'audio') {
            await conn.sendMessage(m.chat, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: m });
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ العرض مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['مؤقتة'];
handler.command = ['مؤقتة', 'readviewonce', 'antiviewonce', 'عرض_مؤقتة'];
handler.category = 'tools';

export default handler;
