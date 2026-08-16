import axios from 'axios';

const handler = async (m, { conn, command, text }) => {
    if (command === 'حساب_الحروف') {
        if (!text?.trim()) return m.reply('*⚠️ اكتب النص اللي عايز تحسبه*\n> مثال: `حساب_الحروف اهلا بالعالم`');
        const clean = text.trim();
        const chars = [...clean].length;
        const charsNoSpaces = [...clean.replace(/\s/g, '')].length;
        const words = clean.split(/\s+/).filter(Boolean).length;
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─⟞🔤⟝─┈─┈─╮\n┃ *إحصائيات النص*\n╰─┈─┈─⟞📊⟝─┈─┈─╯\n\n` +
                `┃ 🔠 عدد الحروف (بالمسافات): ${chars}\n` +
                `┃ 🔡 عدد الحروف (من غير مسافات): ${charsNoSpaces}\n` +
                `┃ 📝 عدد الكلمات: ${words}`
        }, { quoted: m });
    }

    if (command === 'اختصر') {
        const url = text?.trim();
        if (!url || !/^https?:\/\//.test(url)) return m.reply('*⚠️ اكتب رابط صح يبدأ بـ http:// أو https://*\n> مثال: `اختصر https://example.com`');
        try {
            const { data } = await axios.get(`https://tinyurl.com/api-create.php`, { params: { url }, timeout: 10000 });
            if (!data || !data.startsWith('http')) return m.reply('*❌ معرفتش أختصر الرابط ده*');
            return conn.sendMessage(m.chat, { text: `🔗 *الرابط المختصر:*\n${data}` }, { quoted: m });
        } catch {
            return m.reply('*❌ حصلت مشكلة وأنا بختصر، جرب تاني*');
        }
    }

    if (command === 'هيدر') {
        const url = text?.trim();
        if (!url || !/^https?:\/\//.test(url)) return m.reply('*⚠️ اكتب رابط صح*\n> مثال: `هيدر https://example.com`');
        try {
            const res = await axios.head(url, { timeout: 10000, validateStatus: () => true });
            const headers = Object.entries(res.headers).slice(0, 15).map(([k, v]) => `*${k}:* ${v}`).join('\n');
            return conn.sendMessage(m.chat, {
                text: `╭─┈─┈─⟞📡⟝─┈─┈─╮\n┃ *Headers*\n╰─┈─┈─⟞🌐⟝─┈─┈─╯\n\n📶 الحالة: ${res.status}\n\n${headers}`
            }, { quoted: m });
        } catch {
            return m.reply('*❌ معرفتش أوصل للموقع ده*');
        }
    }
};

handler.usage    = ['حساب_الحروف', 'اختصر', 'هيدر'];
handler.category = 'tools';
handler.command  = ['حساب_الحروف', 'اختصر', 'هيدر'];
handler.cooldown = 2000;

export default handler;
