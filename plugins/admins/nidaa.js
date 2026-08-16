// نداء - ينادي على عضو داخل الجروب فقط
const handler = async (m, { conn }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده في الجروبات بس*');

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو أو رد على رسالته يا معلم*');

    // ✅ النداء داخل الجروب بس - مش في الخاص
    return conn.sendMessage(m.chat, {
        text: `📢 *نداء!*\n\n@${target.split('@')[0]} في ناس بيناديك هنا 👋`,
        mentions: [target]
    }, { quoted: m });
};

handler.command  = ['نداء'];
handler.usage    = ['نداء'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
