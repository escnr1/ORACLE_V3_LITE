/**
 * self_commands.js
 * يخلي البوت نفسه يقدر ينفذ الأوامر لما يكتبها
 * - رقم البوت الرئيسي = owner تلقائي
 * - البوتات الفرعية = owner تلقائي
 */

export default async function before(m, { conn, bot }) {
    // لو الرسالة من البوت نفسه
    const botNum = conn?.user?.id?.split(':')[0];
    if (!botNum) return false;

    const senderNum = m.sender?.split('@')[0]?.split(':')[0];
    if (senderNum !== botNum) return false;

    // اعتبره owner عشان ينفذ كل الأوامر
    if (!m.isOwner) {
        m.isOwner = true;
        m.isBotSelf = true;
    }

    return false; // استمر في المعالجة ومتوقفش
}
