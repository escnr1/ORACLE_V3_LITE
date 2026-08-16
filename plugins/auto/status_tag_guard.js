// ════════════════════════════════════════
//  مضاد تاق الحالات (anti-status-tag)
//  لما حد يعمل حالة (Status) على واتساب ويمنشن فيها أعضاء من جروبك،
//  البوت بيكشف ده ويبعت تنبيه في الجروب.
//  ملحوظة: البوت مايقدرش يمسح حالة حد تاني (واتساب مش بيسمح بده)،
//  ده بس كشف وتنبيه، مش منع فعلي.
// ════════════════════════════════════════

import { getG } from '../../system/admin_utils.js';

export default async function before(m, { conn }) {
    // الحالات بتيجي على chat اسمه status@broadcast مش جروب عادي
    if (m.chat !== 'status@broadcast') return false;
    if (!m.sender) return false;

    const ctx = m.message?.extendedTextMessage?.contextInfo
        || m.message?.imageMessage?.contextInfo
        || m.message?.videoMessage?.contextInfo
        || {};
    const mentioned = ctx.mentionedJid || [];
    if (!mentioned.length) return false;

    let groups;
    try {
        groups = await conn.groupFetchAllParticipating();
    } catch {
        return false;
    }

    for (const [gid, meta] of Object.entries(groups || {})) {
        const g = getG(gid);
        if (!g.antiStatusTag) continue;

        const participantIds = (meta.participants || []).map(p => p.id);
        const posterInGroup = participantIds.includes(m.sender);
        const taggedInGroup = mentioned.filter(id => participantIds.includes(id));

        if (posterInGroup && taggedInGroup.length) {
            try {
                await conn.sendMessage(gid, {
                    text:
                        `⚠️ *تنبيه تاق حالة!*\n\n` +
                        `@${m.sender.split('@')[0]} عمل حالة (Status) ومنشن فيها ${taggedInGroup.length} من أعضاء الجروب:\n` +
                        taggedInGroup.map(id => `👤 @${id.split('@')[0]}`).join('\n'),
                    mentions: [m.sender, ...taggedInGroup]
                });
            } catch {}
        }
    }

    return false;
}
