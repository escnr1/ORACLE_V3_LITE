// رسائل سرية - حب_بالسر
const handler = async (m, { conn, command }) => {
    if (command === 'حب_بالسر' || command === 'حب-بالسر') {
        const target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply('*📌 منشن الشخص اللي بتحبه*');
        try {
            await conn.sendMessage(target, {
                text: `💌 *رسالة سرية:*\n\nفي حد بيحبك في الجروب 😊❤️`
            });
            return m.reply(`*✅ الرسالة السرية بتاعتك وصلت! 💌*`);
        } catch { return m.reply('*❌ مش قادر أبعت الرسالة*'); }
    }
};
handler.usage    = ['حب_بالسر'];
handler.category = 'fun';
handler.command  = ['حب_بالسر','حب-بالسر'];
export default handler;
