// add_reply.js - إدارة الردود التلقائية (مطور فقط)

const getDynamic = () => {
    if (!global._gs) global._gs = {};
    if (!global._gs.__replies) global._gs.__replies = {};
    return global._gs.__replies;
};

const handler = async (m, { conn, command, text, bot }) => {
    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner) return;

    const wizard = global.__replyWizard || (global.__replyWizard = {});

    // ═══════════════════════════════
    // .اضف_رد — بدء إضافة رد جديد
    // ═══════════════════════════════
    if (command === 'اضف_رد' || command === 'add_reply') {
        wizard[m.sender] = { step: 'trigger' };

        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─┈─⟞➕⟝─┈─┈─┈─╮\n` +
                `┃ *إضافة رد تلقائي جديد*\n` +
                `╰─┈─┈─┈─⟞➕⟝─┈─┈─┈─╯\n\n` +
                `*الخطوة 1/2*\n` +
                `📩 ابعت الرسالة اللي لما حد يكتبها البوت يرد\n\n` +
                `مثال: لو عايز لما حد يكتب "عامل إيه" البوت يرد،\nابعت: *عامل إيه*\n\n` +
                `*.الغاء_رد* للإلغاء`
        }, { quoted: m });
    }

    // ═══════════════════════════════
    // .الغاء_رد — إلغاء العملية
    // ═══════════════════════════════
    if (command === 'الغاء_رد' || command === 'cancel_reply') {
        if (!wizard[m.sender]) return m.reply('*مفيش عملية شغالة*');
        delete wizard[m.sender];
        return m.reply('*✅ العملية اتلغت*');
    }

    // ═══════════════════════════════
    // .الردود — عرض كل الردود الديناميكية
    // ═══════════════════════════════
    if (command === 'الردود' || command === 'list_replies') {
        const dynamic = getDynamic();
        const keys    = Object.keys(dynamic);

        if (!keys.length) return m.reply('*📋 مفيش ردود ديناميكية مضافة لحد دلوقتي*');

        const lines = keys.map((k, i) =>
            `*${i+1}.* "${k}"\n    ↳ ${dynamic[k].join(' / ')}`
        ).join('\n\n');

        return m.reply(
            `*💬 الردود الديناميكية (${keys.length}):*\n\n${lines}\n\n` +
            `*.حذف_رد <الكلمة>* لحذف رد`
        );
    }

    // ═══════════════════════════════
    // .حذف_رد <الكلمة> — حذف رد
    // ═══════════════════════════════
    if (command === 'حذف_رد' || command === 'delete_reply') {
        const trigger = text?.trim();
        if (!trigger) return m.reply('*اكتب:* .حذف_رد <الكلمة>');

        const dynamic = getDynamic();
        if (!dynamic[trigger]) return m.reply(`*❌ مش لاقي رد للكلمة:* "${trigger}"`);

        delete dynamic[trigger];
        return m.reply(`*✅ الرد اتمسح للكلمة:* "${trigger}"`);
    }
};

handler.command  = ['اضف_رد', 'الغاء_رد', 'الردود', 'حذف_رد', 'add_reply', 'cancel_reply', 'list_replies', 'delete_reply'];
handler.usage    = ['اضف_رد'];
handler.category = 'owner';
handler.owner    = true;

export default handler;
