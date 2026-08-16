import axios from 'axios';

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('*❌ حط رابط الموقع بعد الأمر*\n\nمثال: .سكرين https://google.com');
    }

    let رابط = text.trim();
    if (!رابط.startsWith('http')) رابط = 'https://' + رابط;

    m.react('⏳');
    try {
        const res = await axios.get(
            `https://image.thum.io/get/png/fullpage/viewportWidth/1280/${encodeURIComponent(رابط)}`,
            { responseType: 'arraybuffer', timeout: 45000 }
        );

        await conn.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: `📸 *لقطة شاشة الموقع*\n🔗 ${رابط}`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التقاط الصورة مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['سكرين'];
handler.command = ['سكرين', 'ssweb', 'screenshot', 'لقطة_موقع'];
handler.category = 'tools';

export default handler;
