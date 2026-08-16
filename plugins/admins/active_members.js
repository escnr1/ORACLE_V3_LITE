// المتصلين - مين شايف الرسائل
const handler = async (m, { conn }) => {
    try {
        const meta = await conn.groupMetadata(m.chat);
        const total = meta.participants.length;
        const admins = meta.participants.filter(p => p.admin).map(p => `@${p.id.split('@')[0]}`).join(' ');

        await conn.sendMessage(m.chat, {
            text:
                `👥 *بيانات الأعضاء*\n\n` +
                `📊 كل الأعضاء: *${total}*\n` +
                `👑 الادمنية: ${admins || 'مفيش'}\n\n` +
                `> _البيانات دي لحظتها كده_`,
            mentions: meta.participants.filter(p => p.admin).map(p => p.id)
        }, { quoted: m });
    } catch {
        m.reply('*❌ مقدرتش أجيب البيانات*');
    }
};
handler.command  = ['المتصلين', 'الاعضاء'];
handler.usage    = ['المتصلين'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
