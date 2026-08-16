// جروب - معلومات الجروب
const handler = async (m, { conn }) => {
    try {
        const meta = await conn.groupMetadata(m.chat);
        const admins = meta.participants.filter(p => p.admin).length;
        const members = meta.participants.length;
        const created = new Date(meta.creation * 1000).toLocaleDateString('ar-EG');

        await conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─┈─⟞📋⟝─┈─┈─┈─╮\n` +
                `┃ *معلومات الجروب*\n` +
                `╰─┈─┈─┈─⟞📋⟝─┈─┈─┈─╯\n\n` +
                `📌 *الاسم:* ${meta.subject}\n` +
                `👥 *الأعضاء:* ${members}\n` +
                `👑 *الادمن:* ${admins}\n` +
                `📅 *اتعمل امتى:* ${created}\n` +
                `🔒 *الحالة:* ${meta.announce ? 'مقفول' : 'مفتوح'}\n\n` +
                `📝 *الوصف:*\n${meta.desc || 'مفيش وصف'}`
        }, { quoted: m });
    } catch {
        m.reply('*❌ مقدرتش أجيب بيانات الجروب*');
    }
};
handler.command  = ['جروب', 'معلومات_الجروب'];
handler.usage    = ['جروب'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
