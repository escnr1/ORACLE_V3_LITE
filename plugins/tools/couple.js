/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const تأخير = ms => new Promise(r => setTimeout(r, ms));

const handler = async (m, { conn }) => {
    m.react('💑');
    try {
        const { data } = await axios.get(
            'https://github.com/rikikangsc2-eng/metadata/raw/refs/heads/main/couple.json',
            { timeout: 15000 }
        );
        if (!Array.isArray(data) || !data.length) throw new Error('مالقيتش بيانات');

        const زوج = data[Math.floor(Math.random() * data.length)];
        if (!زوج.male || !زوج.female) throw new Error('البيانات مش مكتملة');

        const [ذكر, أنثى] = await Promise.all([
            axios.get(زوج.male,   { responseType: 'arraybuffer', timeout: 30000 }),
            axios.get(زوج.female, { responseType: 'arraybuffer', timeout: 30000 })
        ]);

        await conn.sendMessage(m.chat, {
            image: Buffer.from(ذكر.data),
            caption: '👦 *صورة الشاب*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });

        await تأخير(500);

        await conn.sendMessage(m.chat, {
            image: Buffer.from(أنثى.data),
            caption: '👧 *صورة الفتاة*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ جلب الصور مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ثنائي'];
handler.command = ['ثنائي', 'couple', 'ppcouple'];
handler.category = 'tools';

export default handler;
