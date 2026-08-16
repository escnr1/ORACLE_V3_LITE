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
            `> الإنذار التالت = طرد على طول`,
        mentions: [sender]
    });
    return count;
};

export default async function before(m, { conn, bot }) {
    if (!m.isGroup) return false;
    const g = getG(m.chat);
    if (!g.antiLink) return false;

    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    if (isOwner || m.isAdmin) return false;

    const text = m.text || m.body ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption || '';

    if (!text) return false;
    const linkRegex = /https?:\/\/[^\s]+|www\.[^\s]+|chat\.whatsapp\.com\/[A-Za-z0-9]+/gi;
    if (!linkRegex.test(text)) return false;

    try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
    await addWarning(m.chat, m.sender, conn, 'نشر رابط 🔗');
    return true;
}
