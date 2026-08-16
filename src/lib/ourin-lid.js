// ════════════════════════════════════════
//  ourin-lid.js — Compatibility shim
//  أدوات التعامل مع نظام LID (Linked ID) الجديد في واتساب مقابل الـ
//  JID التقليدي (رقم الهاتف). بنعتبر أي JID مش منتهي بـ
//  @s.whatsapp.net كـ LID (تقريب معقول لغرض التوافق).
// ════════════════════════════════════════

export function isLid(jid = '') {
    return String(jid).includes('@lid');
}

export function lidToJid(lid, conn) {
    // لو عندنا خريطة تحويل من الـ conn نفسه (بعض نسخ Baileys بتوفرها)، استخدمها
    try {
        const mapped = conn?.lidMapping?.get?.(lid) || conn?.signalRepository?.lidMapping?.getPNForLID?.(lid);
        if (mapped) return mapped;
    } catch {}
    return lid;
}

export function resolveAnyLidToJid(jid, conn) {
    return isLid(jid) ? lidToJid(jid, conn) : jid;
}

export function getParticipantJid(participant) {
    if (!participant) return null;
    const jid = participant.id || participant.jid || participant;
    return resolveAnyLidToJid(jid);
}

export function getParticipantJids(participants = []) {
    return participants.map(getParticipantJid).filter(Boolean);
}

export function findParticipantByNumber(participants = [], number = '') {
    const clean = String(number).replace(/\D/g, '');
    return participants.find(p => getParticipantJid(p)?.includes(clean)) || null;
}

export default { isLid, lidToJid, resolveAnyLidToJid, getParticipantJid, getParticipantJids, findParticipantByNumber };
