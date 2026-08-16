// ════════════════════════════════════════
//  مضاد إعادة التوجيه (anti-forward)
//  ملحوظة: إنفاذ الكتم بقى جوه plugins/protection/mute.js نفسه (handler.before)
//  ════════════════════════════════════════

import { getG, isOwnerFn } from '../../system/admin_utils.js';

export default async function before(m, { conn, bot }) {
    if (!m.isGroup) return false;
    if (isOwnerFn(m.sender, bot, conn) || m.isAdmin) return false;

    const g = getG(m.chat);

    // ═══ مضاد إعادة التوجيه (anti-forward) ═══
    if (g.antiForward) {
        const ctx = m.message?.extendedTextMessage?.contextInfo
            || m.message?.imageMessage?.contextInfo
            || m.message?.videoMessage?.contextInfo
            || m.message?.stickerMessage?.contextInfo
            || m.message?.documentMessage?.contextInfo
            || {};
        const isForwarded = !!ctx.isForwarded || (ctx.forwardingScore || 0) >= 1;

        if (isForwarded) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            try {
                await conn.sendMessage(m.chat, {
                    text: `🚫 *ممنوع إعادة توجيه الرسايل هنا يا @${m.sender.split('@')[0]}*`,
                    mentions: [m.sender]
                });
            } catch {}
            return true;
        }
    }

    return false;
}
