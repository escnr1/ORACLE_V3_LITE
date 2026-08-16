// إدارة قايمة البوتات المعروفة (اللي BotDetector بيراقبها فعليًا)
const handler = async (m, { conn, command, text }) => {
    const detector = global._botDetector;
    if (!detector) return m.reply('*❌ نظام كشف البوتات مش شغال دلوقتي*');

    if (command === 'اضف_بوت' || command === 'تسجيل_بوت') {
        const target = m.mentionedJid?.[0] || (text?.replace(/\D/g, '') ? text.replace(/\D/g, '') + '@s.whatsapp.net' : null);
        if (!target) return m.reply('*⚠️ ابعت الرقم أو منشن*\n_مثال:_ `.اضف_بوت 201234567890`');
        const num = detector.addKnownBot(target);
        return m.reply(`✅ *اتضاف رقم +${num} لقايمة البوتات المعروفة*\n\nدلوقتي أي رسالة تيجي منه في أي جروب هيتراقب.`);
    }

    if (command === 'شيل_بوت') {
        const target = m.mentionedJid?.[0] || (text?.replace(/\D/g, '') ? text.replace(/\D/g, '') + '@s.whatsapp.net' : null);
        if (!target) return m.reply('*⚠️ ابعت الرقم أو منشن*');
        const removed = detector.removeKnownBot(target);
        return m.reply(removed ? '✅ *اتشال من القايمة*' : '*❌ الرقم ده مش في القايمة أصلاً*');
    }

    if (command === 'قايمة_البوتات') {
        const list = detector.listKnownBots();
        if (!list.length) return m.reply('*📋 قايمة البوتات المعروفة فاضية دلوقتي*\n\n_ضيف بوت بـ_ `.اضف_بوت <رقم>`');
        return m.reply(`*📋 البوتات المعروفة (${list.length}):*\n\n${list.map((j, i) => `${i + 1}. +${j.split('@')[0]}`).join('\n')}`);
    }
};

handler.usage    = ['اضف_بوت <رقم>', 'شيل_بوت <رقم>', 'قايمة_البوتات'];
handler.category = 'protection';
handler.command  = ['اضف_بوت', 'تسجيل_بوت', 'شيل_بوت', 'قايمة_البوتات'];
handler.owner    = true;

export default handler;
