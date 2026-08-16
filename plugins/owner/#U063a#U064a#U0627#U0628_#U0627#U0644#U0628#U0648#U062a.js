const isOwner = (m, bot) => bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);

const handler = async (m, { conn, command, text, bot }) => {
    if (!global.db) return m.reply('*❌ قاعدة البيانات مش شغالة دلوقتي*');

    if (command === 'غياب_البوت' || command === 'الغاء_غياب_البوت') {
        if (!isOwner(m, bot)) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');
    }

    if (command === 'غياب_البوت') {
        const reason = text?.trim() || 'مشغول شوية';
        global.db.botAfk = { active: true, reason, since: Date.now() };
        return m.reply(`*✅ اتفعل وضع الغياب: "${reason}"*`);
    }

    if (command === 'الغاء_غياب_البوت') {
        global.db.botAfk = { active: false };
        return m.reply('*✅ رجع البوت متاح عادي*');
    }

    if (command === 'حالة_غياب_البوت') {
        const afk = global.db.botAfk;
        if (!afk?.active) return m.reply('*✅ البوت متاح عادي دلوقتي*');
        const mins = Math.floor((Date.now() - afk.since) / 60000);
        return m.reply(`*⏸️ البوت في وضع غياب*\n> السبب: ${afk.reason}\n> من ${mins} دقيقة`);
    }
};

handler.usage    = ['غياب_البوت', 'الغاء_غياب_البوت', 'حالة_غياب_البوت'];
handler.category = 'owner';
handler.command  = ['غياب_البوت', 'الغاء_غياب_البوت', 'حالة_غياب_البوت'];
handler.cooldown = 1500;

export default handler;
