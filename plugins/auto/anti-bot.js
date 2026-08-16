/**
 * 🛡️ anti-bot.js
 * يمنع البوتات التانية من التدخل في أوامر بوتنا
 * ويمنع بوتنا من التفاعل مع رسائل البوتات الأخرى
 */

const isMyBot = (sender, conn) => {
    // البوت الرئيسي
    const myNum = conn?.user?.id?.split(':')[0];
    if (myNum && sender.includes(myNum)) return true;
    return false;
};

const isMySubBot = (sender) => {
    try {
        const subList = global.subBots?.list?.() || [];
        const senderNum = sender.split('@')[0].split(':')[0];
        return subList.some(b => b.phone === senderNum || String(b.number) === senderNum);
    } catch { return false; }
};

const isOwner = (sender, bot) =>
    bot?.config?.owners?.some(o => o.jid === sender || o.lid === sender);

export default async function before(m, { conn, bot }) {
    if (!m.isGroup) return false;

    const sender = m.sender || '';

    // البوت الرئيسي ومطورين - مرور
    if (isMyBot(sender, conn)) return false;
    if (isOwner(sender, bot)) return false;

    // البوتات الفرعية بتاعتنا - مرور
    if (isMySubBot(sender)) return false;

    // كشف البوت: JID فيه : يعني multi-device = بوت
    const isBot = /^\d+:\d+@s\.whatsapp\.net$/.test(sender);
    if (!isBot) return false;

    // هنا: بوت أجنبي - بس لو antiBots مفعل في الجروب ده
    const antiBots = global._gs?.[m.chat]?.antiBots;
    if (!antiBots) return false; // لو مش مفعل: سماح

    const mode = global._gs?.[m.chat]?.antiBotMode;

    if (mode === 'kick' && m.botAdmin && !m.isAdmin) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
            await conn.sendMessage(m.chat, {
                text: `🤖 اتطرد بوت غريب: @${sender.split('@')[0].split(':')[0]}`,
                mentions: [sender]
            });
        } catch {}
        return true;
    }

    // تجاهل الرسالة بدون طرد
    return true;
}
