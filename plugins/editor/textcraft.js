/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function إنشاء_نص_مزخرف(نص1, نص2 = '', نص3 = '') {
    const params = new URLSearchParams({
        text: نص1, text2: نص2, text3: نص3,
        font_style: 'font1', font_size: 'x', font_colour: '0',
        bgcolour: '#2C262E', glow_halo: '0', glossy: '0',
        lighting: '0', fit_lines: '0', truecolour_images: '0',
        non_trans: 'false', glitter_border: 'true',
        text_border: '1', border_colour: '#2C262E',
        anim_type: 'none', submit_type: 'text',
        perspective_effect: '1', drop_shadow: '1',
        savedb: '0', multiline: '3',
        font_style2: 'font6', font_style3: 'font6',
        font_size2: 't', font_size3: 't',
        font_colour2: '68', font_colour3: '66',
        text_border2: '1', text_border3: '1',
        border_colour2: '#211E4E', border_colour3: '#EBD406'
    });

    const res = await axios.get(`https://textcraft.net/gentext3.php?${params.toString()}`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://textcraft.net/' },
        timeout: 30000
    });

    const match = res.data?.match?.(/<url>(.*?)<\/url>/);
    if (!match?.[1]) throw new Error('مرجعش رابط الصورة');
    return match[1];
}

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎨 صانع نص مزخرف*\n${'━'.repeat(30)}\n\n` +
            `*طريقة الاستخدام:*\n.${command} نص1 | نص2 | نص3\n\n` +
            `*مثال:*\n.${command} ORACLE | LORDS | 2025\n\n` +
            `> *𝐎𝐑𝐀𝐂𝐋𝐄*`
        );
    }

    const أجزاء = text.split('|').map(v => v.trim());
    m.react('⏳');
    try {
        const رابط = await إنشاء_نص_مزخرف(أجزاء[0] || '', أجزاء[1] || '', أجزاء[2] || '');
        const img = await axios.get(رابط, { responseType: 'arraybuffer', timeout: 30000 });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(img.data),
            caption: `🎨 *نص مزخرف*\n📝 ${text.slice(0, 50)}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الإنشاء مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['نص_تأثير'];
handler.command = ['نص_تأثير', 'textcraft', 'glowtext'];
handler.category = 'editor';

export default handler;
