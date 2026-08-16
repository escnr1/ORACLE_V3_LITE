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

async function بحث_ncs(استعلام) {
    const res = await axios.get(`https://ncs.io/music?q=${encodeURIComponent(استعلام)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
        timeout: 20000
    });
    const $ = cheerio.load(res.data);
    const نتائج = [];
    $('.release-list .release').each((i, el) => {
        if (i >= 5) return;
        const عنوان = $(el).find('.release-title').text().trim();
        const فنان = $(el).find('.release-artist').text().trim();
        const رابط = 'https://ncs.io' + ($(el).find('a').attr('href') || '');
        const صورة = $(el).find('img').attr('src') || '';
        if (عنوان) نتائج.push({ عنوان, فنان, رابط, صورة });
    });
    return نتائج;
}

async function تحميل_ncs(رابط_أغنية) {
    const res = await axios.get(رابط_أغنية, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
        timeout: 20000
    });
    const $ = cheerio.load(res.data);
    const رابط_mp3 = $('a[href*=".mp3"]').first().attr('href') ||
        $('[data-url*=".mp3"]').first().attr('data-url');
    if (!رابط_mp3) throw new Error('مالقيتش رابط MP3');
    return رابط_mp3.startsWith('http') ? رابط_mp3 : 'https://ncs.io' + رابط_mp3;
}

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎵 موسيقى NCS بدون حقوق*\n${'━'.repeat(30)}\n\n` +
            `*البحث:*\n.${command} Alan Walker\n\n` +
            `*التحميل المباشر:*\n.${command} dl [رابط_الأغنية]\n\n` +
            `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        );
    }

    m.react('⏳');
    try {
        if (text.startsWith('dl ') || text.startsWith('تحميل ')) {
            const رابط = text.split(' ').slice(1).join(' ').trim();
            const mp3_url = await تحميل_ncs(رابط);
            const صوت = await axios.get(mp3_url, { responseType: 'arraybuffer', timeout: 120000 });
            await conn.sendMessage(m.chat, {
                audio: Buffer.from(صوت.data),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: m });
        } else {
            const نتائج = await بحث_ncs(text);
            if (!نتائج.length) throw new Error('مالقيتش نتايج');
            let رد = `*🎵 نتائج NCS: ${text}*\n${'━'.repeat(30)}\n\n`;
            نتائج.forEach((r, i) => {
                رد += `*${i + 1}.* ${r.عنوان}\n👤 ${r.فنان}\n🔗 ${r.رابط}\n\n`;
            });
            رد += `*للتحميل:* .${command} dl [الرابط]\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`;
            m.reply(رد);
        }
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ncs'];
handler.command = ['ncs', 'ncsdl'];
handler.category = 'download';

export default handler;
