// admin_utils.js - دوال مشتركة للتعامل مع الادمن/المطورين
// منقولة هنا عشان تكون قابلة للـ import الصحيح (export) من أي ملف

export const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

// فحص المطور من config الرئيسي حتى لو بوت فرعي
export const isOwnerFn = (id, bot, conn) => {
    const owners = bot?.config?.owners || global._mainOwners || [];
    const botJid = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';
    return (
        owners.some(o => o.jid === id || o.lid === id) ||
        id === botJid ||
        id?.split(':')[0] + '@s.whatsapp.net' === botJid
    );
};

// المرسل ادمن أو مطور؟
export const canUseAdminCmd = (m, bot, conn) =>
    isOwnerFn(m.sender, bot, conn) || m.isAdmin || m.isSuperAdmin;

// ===== مساعد: جيب الرقم الأساسي من أي id =====
export const numOf = (id) => id?.split('@')[0]?.split(':')[0] || '';

export const resolveRealNumber = async (sender, conn) => {
    if (!sender) return null;

    if (sender.endsWith('@s.whatsapp.net')) {
        return numOf(sender);
    }

    if (sender.endsWith('@lid')) {
        try {
            const pn = await conn?.signalRepository?.lidMapping?.getPNForLID?.(sender);
            if (pn) return numOf(pn);
        } catch {}

        try {
            const res = await conn?.onWhatsApp?.(sender);
            const match = res?.find?.(r => r?.jid?.endsWith('@s.whatsapp.net'));
            if (match) return numOf(match.jid);
        } catch {}

        return null;
    }

    return numOf(sender);
};

// ===== مساعد: شوف لو id موجود في قائمة (بيقارن بالرقم) =====
export const isInList = (list, id) => {
    if (!list?.length || !id) return false;
    const n = numOf(id);
    return list.some(u => u === id || numOf(u) === n);
};

// ===== مساعد: امسح id من قائمة (بيمسح كل التطابقات بالرقم) =====
export const removeFromList = (list, id) => {
    if (!list?.length || !id) return list || [];
    const n = numOf(id);
    return list.filter(u => u !== id && numOf(u) !== n);
};

// 🔧 حل مشكلة "forbidden":
// واتساب بيخزن بعض الأعضاء بـ @lid مختلف عن الـ jid
// الحل: نجيب groupMetadata ونجرب كل الـ ids البديلة
export const updateParticipant = async (chat, target, action, conn) => {
    let meta;
    try { meta = await conn.groupMetadata(chat); } catch { meta = null; }

    const targetNum = numOf(target);
    const found = meta?.participants?.find(p => {
        return p.id === target || p.lid === target || p.jid === target || numOf(p.id) === targetNum;
    });

    const candidates = [...new Set([
        found?.id,
        found?.lid,
        found?.jid,
        target
    ].filter(Boolean))];

    let lastErr;
    for (const id of candidates) {
        try {
            await conn.groupParticipantsUpdate(chat, [id], action);
            return { ok: true };
        } catch (e) {
            lastErr = e;
            const msg = String(e?.message || e?.toString?.() || '').toLowerCase();
            const code = e?.output?.statusCode || e?.status;
            if (!(msg.includes('forbidden') || code === 403)) break;
        }
    }
    return { ok: false, error: lastErr };
};

export const addWarn = async (chat, sender, conn, reason, bot) => {
    const g = getG(chat);
    if (!g.warnings) g.warnings = {};
    const count = (g.warnings[sender] || 0) + 1;
    g.warnings[sender] = count;
    const max = g.maxWarnings || 3;

    if (count >= max) {
        g.warnings[sender] = 0;
        try {
            await conn.sendMessage(chat, {
                text: `⛔ *اتطرد @${sender.split('@')[0]}*\nالسبب: ${reason} - إنذار ${max}/${max}`,
                mentions: [sender]
            });
            await updateParticipant(chat, sender, 'remove', conn);
        } catch {}
        return max;
    }

    await conn.sendMessage(chat, {
        text: `${'⚠️'.repeat(count)} *إنذار ${count}/${max}*\n@${sender.split('@')[0]}\nالسبب: ${reason}\n\n> الإنذار ${max} = طرد على طول`,
        mentions: [sender]
    });
    return count;
};
