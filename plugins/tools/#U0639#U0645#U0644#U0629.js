import axios from 'axios';

const handler = async (m, { conn, text }) => {
    const parts = (text || '').trim().split(/\s+/);
    if (parts.length < 3) {
        return m.reply('*⚠️ الصيغة:*\n`عملة <المبلغ> <من> <إلى>`\n> مثال: `عملة 100 USD EGP`');
    }
    const [amountStr, from, to] = parts;
    const amount = parseFloat(amountStr);
    if (!Number.isFinite(amount)) return m.reply('*⚠️ اكتب مبلغ صح*');

    try {
        const { data } = await axios.get(`https://open.er-api.com/v6/latest/${from.toUpperCase()}`, { timeout: 10000 });
        if (data.result !== 'success') return m.reply('*❌ مقدرتش أجيب سعر الصرف، اتأكد من رمز العملة (زي USD, EGP, SAR)*');

        const rate = data.rates[to.toUpperCase()];
        if (!rate) return m.reply('*❌ العملة التانية مش معروفة*');

        const converted = (amount * rate).toFixed(2);
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─⟞💱⟝─┈─┈─╮\n┃ *تحويل العملة*\n╰─┈─┈─⟞💰⟝─┈─┈─╯\n\n` +
                `${amount} ${from.toUpperCase()} = *${converted} ${to.toUpperCase()}*\n\n` +
                `> سعر الصرف محدّث لحظيًا`
        }, { quoted: m });
    } catch {
        return m.reply('*❌ حصلت مشكلة في جلب سعر الصرف، جرب تاني بعد شوية*');
    }
};

handler.usage    = ['عملة'];
handler.category = 'tools';
handler.command  = ['عملة'];
handler.cooldown = 3000;

export default handler;
