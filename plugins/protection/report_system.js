// نظام البلاغات والأدمن
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');

    // ===== report/admins/groupinfo - متاحة لكل الأعضاء =====
    if (command === 'report' || command === 'بلاغ') {
        const target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply('*منشن العضو أو رد على رسالته يا معلم*');

        try {
            const meta = await conn.groupMetadata(m.chat);
            const admins = meta.participants.filter(p => p.admin).map(p => p.id);

            await conn.sendMessage(m.chat, {
                text:
                    `🚨 *بلاغ جديد*\n\n` +
                    `📢 المُبلِّغ: @${m.sender.split('@')[0]}\n` +
                    `🎯 المُبلَّغ عنه: @${target.split('@')[0]}\n` +
                    `📝 السبب: ${text || 'معتش متحدد'}\n\n` +
                    `👑 الادمنية: ${admins.map(a => `@${a.split('@')[0]}`).join(' ')}`,
                mentions: [m.sender, target, ...admins]
            }, { quoted: m });
        } catch { m.reply('*❌ البلاغ مضربش يتبعت*'); }
        return;
    }

    if (command === 'admins' || command === 'الادمنية') {
        try {
            const meta = await conn.groupMetadata(m.chat);
            const admins = meta.participants.filter(p => p.admin);
            if (!admins.length) return m.reply('*مفيش أدمن في الجروب*');

            const list = admins.map((a, i) =>
                `${i+1}. @${a.id.split('@')[0]} ${a.admin === 'superadmin' ? '👑' : '⚡'}`
            ).join('\n');

            await conn.sendMessage(m.chat, {
                text: `👑 *الادمنية (${admins.length}):*\n\n${list}`,
                mentions: admins.map(a => a.id)
            }, { quoted: m });
        } catch { m.reply('*❌ مقدرتش أجيب البيانات*'); }
        return;
    }

    if (command === 'groupinfo' || command === 'info_group' || command === 'بيانات_الجروب') {
        try {
            const meta = await conn.groupMetadata(m.chat);
            const admins = meta.participants.filter(p => p.admin).length;
            const g = global._gs?.[m.chat] || {};
            const created = new Date(meta.creation * 1000).toLocaleDateString('ar-EG');

            await conn.sendMessage(m.chat, {
                text:
                    `╭─┈─┈─┈─⟞📋⟝─┈─┈─┈─╮\n` +
                    `┃ *معلومات الجروب*\n` +
                    `╰─┈─┈─┈─⟞📋⟝─┈─┈─┈─╯\n\n` +
                    `📌 الاسم: ${meta.subject}\n` +
                    `👥 الأعضاء: ${meta.participants.length}\n` +
                    `👑 الادمن: ${admins}\n` +
                    `📅 اتعملت امتى: ${created}\n` +
                    `🔒 الحالة: ${meta.announce ? 'مقفول' : 'مفتوح'}\n` +
                    `🛡️ مستوى الحماية: ${g.securityLevel ? `Level ${g.securityLevel}` : 'مش متحدد'}\n` +
                    `⚠️ الإنذارات: ${Object.keys(g.warnings || {}).length} عضو\n` +
                    `🚫 المحظورين: ${(g.banned || []).length}`
            }, { quoted: m });
        } catch { m.reply('*❌ مقدرتش أجيب البيانات*'); }
        return;
    }

    // ===== listwarn - أدمن فقط =====
    if (command === 'listwarn' || command === 'كل_الانذارات') {
        await adminGuard(m, { conn, bot });
        if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

        const warnings = global._gs?.[m.chat]?.warnings || {};
        const list = Object.entries(warnings).filter(([, v]) => v > 0);
        if (!list.length) return m.reply('*✅ مفيش إنذارات دلوقتي*');
        const text2 = list.map(([id, cnt], i) =>
            `${i+1}. @${id.split('@')[0]}: ${'⚠️'.repeat(cnt)} (${cnt}/3)`
        ).join('\n');
        return conn.sendMessage(m.chat, {
            text: `📋 *كل الإنذارات:*\n\n${text2}`,
            mentions: list.map(([id]) => id)
        }, { quoted: m });
    }
};

handler.command  = ['report', 'بلاغ', 'admins', 'الادمنية', 'groupinfo', 'info_group', 'بيانات_الجروب', 'listwarn', 'كل_الانذارات'];
handler.usage    = ['report', 'admins', 'groupinfo'];
handler.category = 'protection';
export default handler;
