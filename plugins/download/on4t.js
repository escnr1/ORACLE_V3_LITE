/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function تحميل_on4t(رابط) {
    const res = await axios.post('https://on4t.com/download', { url: رابط }, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
            'Referer': 'https://on4t.com/'
        },
        timeout: 30000
    });

    const نتائج = res.data?.data || res.data?.videos || [];
    if (!نتائج.length) {
        // جرب API بديلة
        const $ = cheerio.load((await axios.get(`https://on4t.com/?url=${encodeURIComponent(رابط)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000
        })).data);
        const روابط = [];
        $('a[href*=".mp4"], a[download]').each((_, el) => {
            const href = $(el).attr('href');
            if (href?.startsWith('http')) روابط.push({ url: href, quality: $(el).text().trim() });
        });
        if (!روابط.length) throw new Error('مقدرتش أجيب الفيديو من الرابط ده');
        return روابط;
    }
    return نتائج;
}

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*⬇️ تحميل فيديو (متعدد المنصات)*\n${'━'.repeat(30)}\n\n` +
            `*طريقة الاستخدام:*\n.${command} [رابط]\n\n` +
            `*المنصات المدعومة:*\n` +
            `تيك توك | انستقرام | فيسبوك\n` +
            `تويتر | بينتريست | Vimeo\n` +
            `Dailymotion | وغيرها\n\n` +
            `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        );
    }

    if (!text.startsWith('http')) return m.reply('*❌ حط الرابط كاملاً مع https://*');

    m.react('⏳');
    try {
        const نتائج = await تحميل_on4t(text.trim());
        const أفضل = نتائج[0];
        const رابط_فيديو = أفضل?.url || أفضل?.video_file_url || أفضل?.link;
        if (!رابط_فيديو) throw new Error('مالقيتش رابط للتحميل');

        const فيديو = await axios.get(رابط_فيديو, { responseType: 'arraybuffer', timeout: 120000 });

        await conn.sendMessage(m.chat, {
            video: Buffer.from(فيديو.data),
            mimetype: 'video/mp4',
            caption: `✅ *اتحمل تمام*\n🔗 ${text.slice(0, 50)}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تحميل_فيديو'];
handler.command = ['تحميل_فيديو', 'on4t', 'dl'];
handler.category = 'download';

export default handler;
