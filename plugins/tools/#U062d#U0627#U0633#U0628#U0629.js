import * as math from 'mathjs';

const handler = async (m, { conn, text }) => {
    const expr = text?.trim();
    if (!expr) return m.reply('*⚠️ اكتب المعادلة أو العملية الحسابية*\n> مثال: `حاسبة 5*(3+2)^2`\n> أو: `حاسبة sqrt(144)`');

    try {
        const result = math.evaluate(expr);
        return conn.sendMessage(m.chat, {
            text: `🧮 *${expr}*\n\n= *${result}*`
        }, { quoted: m });
    } catch {
        return m.reply('*❌ المعادلة غلط أو الصيغة مش مفهومة، جرب تاني*');
    }
};

handler.usage    = ['حاسبة'];
handler.category = 'tools';
handler.command  = ['حاسبة'];
handler.cooldown = 1500;

export default handler;
