/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_تطبيق(اسم) {
    const res = await axios.get(`https://apkpure.com/search?q=${encodeURIComponent(اسم)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
        timeout: 20000
    });

    const html = res.data;
    const matches = [...html.matchAll(/<a class="first-info"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span class="p-name">([^<]+)<\/span>/g)];
    if (!matches.length) throw new Error('مالقيتش نتايج');

    return matches.slice(0, 5).map(m => ({
        اسم: m[2].trim(),
        رابط: `https://apkpure.com${m[1]}`
    }));
}

const handler = async (m, { text, command }) => {
    if (!text) return m.reply(`*❌ اكتب اسم التطبيق بعد الأمر*\n\nمثال: .${command} WhatsApp`);

    m.react('🔍');
    try {
        const نتائج = await بحث_تطبيق(text);

        let رد = `*📱 نتائج البحث: ${text}*\n${'━'.repeat(30)}\n\n`;
        نتائج.forEach((app, i) => {
            رد += `*${i + 1}.* ${app.اسم}\n🔗 ${app.رابط}\n\n`;
        });
        رد += `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`;

        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ البحث مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تطبيق'];
handler.command = ['تطبيق', 'apk', 'apksearch'];
handler.category = 'download';

export default handler;
