const getG = (chatId) => global._gs?.[chatId] || {};

const addWarning = async (chat, sender, conn, reason) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chat]) global._gs[chat] = {};
    if (!global._gs[chat].warnings) global._gs[chat].warnings = {};
    const count = (global._gs[chat].warnings[sender] || 0) + 1;
    global._gs[chat].warnings[sender] = count;

    if (count >= 3) {
        global._gs[chat].warnings[sender] = 0;
        try {
            await conn.sendMessage(chat, {
                text: `⛔ *اتطرد @${sender.split('@')[0]}*\nالسبب: ${reason} - إنذار تالت`,
                mentions: [sender]
            });
            await conn.groupParticipantsUpdate(chat, [sender], 'remove');
        } catch {}
        return 3;
    }

    await conn.sendMessage(chat, {
        text:
            `${'⚠️'.repeat(count)} *إنذار ${count}/3*\n\n` +
            `@${sender.split('@')[0]}\n` +
            `السبب: ${reason}\n\n` +
            `${count === 3 ? '⛔ هتتطرد دلوقتي!' : `> الإنذار التالت = طرد على طول`}`,
        mentions: [sender]
    });
    return count;
};

export default async function before(m, { conn, bot }) {
    if (!m.isGroup) return false;
    const g = getG(m.chat);

    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    const skip = isOwner || m.isAdmin;

    // ===== ضد الشاتم =====
    if (g.antiCurse && !skip) {
        const curseWords = ['يلعن','العن','كس','طيز','زب','شرموط','عرص','خول','متناك','نيك','كسم'];
        const text = m.text || m.body || '';
        if (curseWords.some(w => text.includes(w))) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await addWarning(m.chat, m.sender, conn, 'شتيمة 🤬');
            return true;
        }
    }

    // ===== مضاد الستيكر =====
    if (g.antiSticker && m.message?.stickerMessage && !skip) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
        await addWarning(m.chat, m.sender, conn, 'إرسال ستيكر 🎭');
        return true;
    }

    // ===== مضاد الفيديو =====
    if (g.antiVideo && (m.message?.videoMessage || m.message?.videoNoteMessage) && !skip) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
        await addWarning(m.chat, m.sender, conn, 'إرسال فيديو 🎬');
        return true;
    }

    // ===== مضاد الصور =====
    if (g.antiImage && m.message?.imageMessage && !skip) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
        await addWarning(m.chat, m.sender, conn, 'إرسال صورة 🖼️');
        return true;
    }

    // ===== مضاد الصوت =====
    if (g.antiAudio && (m.message?.audioMessage || m.message?.pttMessage) && !skip) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
        await addWarning(m.chat, m.sender, conn, 'إرسال صوت 🔉');
        return true;
    }

    return false;
}
