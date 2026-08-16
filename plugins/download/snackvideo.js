/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function تحميل_سناك(رابط) {
    const res = await axios.post('https://snapsave.app/action.php',
        `url=${encodeURIComponent(رابط)}`,
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Referer': 'https://snapsave.app/'
            },
            timeout: 30000
        }
    );

    const html = res.data;
    const رابط_فيديو = html.match(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/)?.[1];
    if (!رابط_فيديو) throw new Error('مقدرتش أجيب رابط الفيديو');
    return رابط_فيديو;
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ حط رابط سناك فيديو بعد الأمر*\n\nمثال: .سناك https://snackvideo.com/...');

    if (!text.includes('snackvideo') && !text.includes('snack.video')) {
        return m.reply('*❌ الرابط مش من سناك فيديو*');
    }

    m.react('⏳');
    try {
        const video_url = await تحميل_سناك(text.trim());
        const res = await axios.get(video_url, { responseType: 'arraybuffer', timeout: 120000 });

        await conn.sendMessage(m.chat, {
            video: Buffer.from(res.data),
            caption: '✅ *اتحمل من سناك فيديو*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*',
            mimetype: 'video/mp4'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['سناك'];
handler.command = ['سناك', 'snackvideo', 'snack'];
handler.category = 'download';

export default handler;
