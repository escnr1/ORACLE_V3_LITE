/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import sharp from 'sharp';

async function إنشاء_ميم(buffer, نص_فوق = '', نص_تحت = '') {
    const صورة = sharp(buffer);
    const { width: عرض = 512, height: طول = 512 } = await صورة.metadata();

    const حجم = Math.max(28, Math.floor(عرض / 14));

    const رسم_نص = (نص, y) => {
        if (!نص) return '';
        const مؤمن = نص.toUpperCase()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<text
            x="${عرض / 2}" y="${y}"
            font-family="Impact, Arial Black, sans-serif"
            font-size="${حجم}" font-weight="bold"
            text-anchor="middle"
            fill="white"
            stroke="black" stroke-width="${Math.ceil(حجم / 8)}"
            paint-order="stroke">${مؤمن}</text>`;
    };

    const svg = Buffer.from(`
        <svg width="${عرض}" height="${طول}" xmlns="http://www.w3.org/2000/svg">
            ${رسم_نص(نص_فوق, حجم + 8)}
            ${رسم_نص(نص_تحت, طول - 12)}
        </svg>
    `);

    return await sharp(buffer)
        .composite([{ input: svg, top: 0, left: 0 }])
        .jpeg({ quality: 90 })
        .toBuffer();
}

const handler = async (m, { conn, text }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image')) {
        return m.reply(
            `*😂 إنشاء ميم*\n${'━'.repeat(30)}\n\n` +
            `*طريقة الاستخدام:*\nرد على صورة مع:\n.ميم [نص فوق] | [نص تحت]\n\n` +
            `*مثال:*\n.ميم عندما تنتظر | ولا يجي 😂\n\n` +
            `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        );
    }

    m.react('⏳');
    try {
        const buffer = await q.download();
        const أجزاء = (text || '').split('|').map(v => v.trim());
        const ناتج = await إنشاء_ميم(buffer, أجزاء[0] || '', أجزاء[1] || '');

        await conn.sendMessage(m.chat, {
            image: ناتج,
            caption: '😂 *الميم اتعمل*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الإنشاء مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ميم'];
handler.command = ['ميم', 'meme', 'smeme'];
handler.category = 'sticker';

export default handler;
