/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function تحميل_ثريدز(رابط) {
    const res = await axios.post(
        'https://threadsvideodl.com/api/download',
        { url: رابط },
        {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Referer': 'https://threadsvideodl.com/'
            },
            timeout: 30000
        }
    );

    const media = res.data?.data || res.data?.medias || res.data?.media;
    if (!media?.length && !media?.url) throw new Error('مقدرتش أجيب المحتوى');

    if (Array.isArray(media)) return media;
    return [{ url: media.url, type: media.type || 'video' }];
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ حط رابط ثريدز بعد الأمر*\n\nمثال: .ثريدز https://www.threads.net/...');

    if (!text.includes('threads.net')) return m.reply('*❌ الرابط مش من ثريدز*');

    m.react('⏳');
    try {
        const ميديا = await تحميل_ثريدز(text.trim());

        for (const item of ميديا.slice(0, 4)) {
            const res = await axios.get(item.url, { responseType: 'arraybuffer', timeout: 120000 });
            const buffer = Buffer.from(res.data);
            const نوع = item.type?.includes('video') ? 'video' : 'image';

            if (نوع === 'video') {
                await conn.sendMessage(m.chat, {
                    video: buffer, mimetype: 'video/mp4',
                    caption: '✅ *اتحمل من ثريدز*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, {
                    image: buffer,
                    caption: '✅ *اتحمل من ثريدز*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
                }, { quoted: m });
            }
        }
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ثريدز'];
handler.command = ['ثريدز', 'threads', 'threadsdl'];
handler.category = 'download';

export default handler;
