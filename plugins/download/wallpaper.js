/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_خلفيات(كلمة) {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: كلمة, per_page: 5, orientation: 'portrait' },
        headers: { Authorization: 'Client-ID LNuMuuqHGbXRIxuQTjuUhTVKMoS9cj8VuU_5ODZRAQQ' },
        timeout: 15000
    });
    const صور = res.data?.results;
    if (!صور?.length) throw new Error('مالقيتش خلفيات');
    return صور.map(p => ({ رابط: p.urls?.full || p.urls?.regular, مصور: p.user?.name || 'مجهول' }));
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ اكتب كلمة البحث بعد الأمر*\n\nمثال: .خلفية nature\nأو: .خلفية cars');

    m.react('🖼️');
    try {
        const صور = await بحث_خلفيات(text);

        for (const صورة of صور.slice(0, 3)) {
            const res = await axios.get(صورة.رابط, { responseType: 'arraybuffer', timeout: 30000 });
            await conn.sendMessage(m.chat, {
                image: Buffer.from(res.data),
                caption: `🖼️ *خلفية*\n📷 ${صورة.مصور}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
            }, { quoted: m });
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ البحث مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['خلفية'];
handler.command = ['خلفية', 'wallpaper', 'خلفيات'];
handler.category = 'download';

export default handler;
