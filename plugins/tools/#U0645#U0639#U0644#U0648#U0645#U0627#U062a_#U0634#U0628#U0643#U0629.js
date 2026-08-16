import axios from 'axios';

const handler = async (m, { conn, text }) => {
    const query = text?.trim();
    if (!query) return m.reply('*⚠️ اكتب آي بي أو دومين*\n> مثال: `معلومات_شبكة 8.8.8.8`');

    try {
        const { data } = await axios.get(`http://ip-api.com/json/${encodeURIComponent(query)}?lang=ar`, { timeout: 10000 });
        if (data.status !== 'success') {
            return m.reply('*❌ معرفناش نجيب معلومات عن الآي بي/الدومين ده*');
        }
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─⟞🌐⟝─┈─┈─╮\n┃ *معلومات الشبكة*\n╰─┈─┈─⟞📡⟝─┈─┈─╯\n\n` +
                `┃ 🔢 الآي بي: ${data.query}\n` +
                `┃ 🌍 الدولة: ${data.country || 'مش معروف'}\n` +
                `┃ 🏙️ المدينة: ${data.city || 'مش معروف'}\n` +
                `┃ 🏢 مزود الخدمة: ${data.isp || 'مش معروف'}\n` +
                `┃ 🏛️ المنظمة: ${data.org || 'مش معروف'}\n` +
                `┃ 🕐 التوقيت: ${data.timezone || 'مش معروف'}`
        }, { quoted: m });
    } catch {
        return m.reply('*❌ حصلت مشكلة في الاتصال بخدمة البحث، جرب تاني بعد شوية*');
    }
};

handler.usage    = ['معلومات_شبكة'];
handler.category = 'tools';
handler.command  = ['معلومات_شبكة'];
handler.cooldown = 3000;

export default handler;
