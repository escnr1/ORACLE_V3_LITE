/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function قصر_رابط(رابط) {
    // نجرب TinyURL أولاً
    try {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(رابط)}`, {
            timeout: 10000
        });
        if (res.data?.startsWith('http')) return res.data;
    } catch {}

    // بديل: is.gd
    try {
        const res = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(رابط)}`, {
            timeout: 10000
        });
        if (res.data?.startsWith('http')) return res.data;
    } catch {}

    // بديل: cleanuri
    const res = await axios.post('https://cleanuri.com/api/v1/shorten', `url=${encodeURIComponent(رابط)}`, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeout: 10000
    });
    if (res.data?.result_url) return res.data.result_url;

    throw new Error('التقصير مضربش');
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ حط الرابط بعد الأمر*\n\nمثال: .قصر https://youtube.com/watch?v=...');

    let رابط = text.trim();
    if (!رابط.startsWith('http')) رابط = 'https://' + رابط;

    m.react('⏳');
    try {
        const رابط_قصير = await قصر_رابط(رابط);
        m.reply(`*🔗 الرابط اتقصّر*\n\n${رابط_قصير}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التقصير مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['قصر'];
handler.command = ['قصر', 'shortlink', 'shorturl', 'تقصير'];
handler.category = 'tools';

export default handler;
