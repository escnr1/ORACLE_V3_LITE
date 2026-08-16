// مضادات متقدمة: spam, tag, fake, delete, edit, flood
const getG = (chatId) => global._gs?.[chatId] || {};
const isOwner = (id, bot) => bot?.config?.owners?.some(o => o.jid === id || o.lid === id);

// تحذير مع طرد عند 3
const warn = async (chat, sender, conn, reason, maxWarnings = 3) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chat]) global._gs[chat] = {};
    if (!global._gs[chat].warnings) global._gs[chat].warnings = {};
    const count = (global._gs[chat].warnings[sender] || 0) + 1;
    global._gs[chat].warnings[sender] = count;
    const max = global._gs[chat].maxWarnings || maxWarnings;

    if (count >= max) {
        global._gs[chat].warnings[sender] = 0;
        try {
            await conn.sendMessage(chat, {
                text: `⛔ *اتطرد @${sender.split('@')[0]}*\nالسبب: ${reason} - إنذار ${max}/${max}`,
                mentions: [sender]
            });
            await conn.groupParticipantsUpdate(chat, [sender], 'remove');
        } catch {}
        return max;
    }

    // وضع صارم = طرد على طول
    if (global._gs[chat].strictMode) {
        try {
            await conn.sendMessage(chat, {
                text: `⛔ *وضع صارم - اتطرد @${sender.split('@')[0]}*\nالسبب: ${reason}`,
                mentions: [sender]
            });
            await conn.groupParticipantsUpdate(chat, [sender], 'remove');
        } catch {}
        return max;
    }

    await conn.sendMessage(chat, {
        text: `${'⚠️'.repeat(count)} *إنذار ${count}/${max}*\n@${sender.split('@')[0]}\nالسبب: ${reason}`,
        mentions: [sender]
    });
    return count;
};

// تتبع الإزعاج
const spamTracker = new Map();
const tagTracker  = new Map();

export default async function before(m, { conn, bot }) {
    if (!m.isGroup) return false;
    const g = getG(m.chat);
    if (isOwner(m.sender, bot) || m.isAdmin) return false;

    // ===== مضاد الإزعاج (spam) =====
    if (g.antiSpam) {
        const key = `${m.chat}_${m.sender}`;
        const now = Date.now();
        const track = spamTracker.get(key) || { count: 0, first: now };

        if (now - track.first < 5000) {
            track.count++;
            if (track.count >= 5) {
                spamTracker.delete(key);
                try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
                await warn(m.chat, m.sender, conn, 'إزعاج/سبام 📢');
                return true;
            }
            spamTracker.set(key, track);
        } else {
            spamTracker.set(key, { count: 1, first: now });
        }
    }

    // ===== مضاد المنشن الجماعي (anti-tag) =====
    if (g.antiTag) {
        const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length >= 5) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await warn(m.chat, m.sender, conn, 'منشن جماعي 🏷️');
            return true;
        }
    }

    // ===== مضاد الأرقام الوهمية (anti-fake) =====
    if (g.antiFake) {
        const num = m.sender.split('@')[0].split(':')[0];
        // الأرقام الوهمية عادة أقل من 7 أرقام أو تبدأ بـ 00000
        if (num.length < 7 || num.startsWith('00000') || num === '0') {
            try { await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'); } catch {}
            return true;
        }
    }

    // ===== مضاد الرسائل الطويلة (flood) =====
    if (g.antiFlood) {
        const text = m.text || m.body || '';
        if (text.length > 1000) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await warn(m.chat, m.sender, conn, 'رسالة طويلة جداً 📝');
            return true;
        }
    }

    // ===== كشف الرسائل المحذوفة (anti-delete) =====
    if (g.antiDelete && m.message?.protocolMessage?.type === 0) {
        const deleted = m.message.protocolMessage;
        const originalKey = deleted.key;
        if (originalKey?.remoteJid === m.chat) {
            await conn.sendMessage(m.chat, {
                text: `🗑️ *${m.pushName || 'حد ما'} مسح رسالة!*\n> _اتلقطت_`
            });
        }
        return false;
    }

    // ===== كشف تعديل الرسائل (anti-edit) =====
    if (g.antiEdit && m.message?.editedMessage) {
        await conn.sendMessage(m.chat, {
            text: `✏️ *${m.pushName || 'حد ما'} عدّل رسالته!*\n> _اتلقط التعديل_`
        });
        return false;
    }

    return false;
}
