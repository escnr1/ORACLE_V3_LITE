// نظام الحظر - يشتغل مع المطورين والادمنز على الرئيسي والفرعي
import { getG, isOwnerFn, canUseAdminCmd, isInList, removeFromList, updateParticipant } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown, notAuthMsg, notAdminMsg, isBotActualAdmin } from '../../system/bot_protection.js';

const handler = async (m, { conn, command, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');

    // Live check: تحديث isBotAdmin/isAdmin
    await adminGuard(m, { conn, bot });

    const cooldown = checkCommandCooldown(command, m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);

    if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

    const g = getG(m.chat);
    const target = m.mentionedJid?.[0] || m.quoted?.sender;

    // ===== حظر =====
    if (command === 'ban' || command === 'حظر') {
        if (!target) return m.reply('*منشن العضو أو رد على رسالته يا معلم*');
        if (isOwnerFn(target, bot, conn)) return m.reply('*❌ مينفعش تحظر المطور*');
        if (!g.banned) g.banned = [];

        if (isInList(g.banned, target)) return conn.sendMessage(m.chat, {
            text: `*❌ @${target.split('@')[0]} محظور بالفعل*`, mentions: [target]
        });

        g.banned.push(target);

        if (m.isBotAdmin) {
            const res = await updateParticipant(m.chat, target, 'remove', conn);
            if (!res.ok) console.log('[ban] remove failed:', res.error?.message);
        } else {
            await m.reply(notAdminMsg());
        }

        return conn.sendMessage(m.chat, {
            text: `🚫 *@${target.split('@')[0]} اتحظر*\nمش هيقدر يرجع تاني للجروب`,
            mentions: [target]
        }, { quoted: m });
    }

    // ===== فك الحظر =====
    if (command === 'unban' || command === 'فك_حظر') {
        if (!target) return m.reply('*منشن العضو يا معلم*');

        if (!isInList(g.banned, target)) return conn.sendMessage(m.chat, {
            text: `*❌ @${target.split('@')[0]} مش محظور أصلاً*`, mentions: [target]
        });

        g.banned = removeFromList(g.banned, target);

        return conn.sendMessage(m.chat, {
            text: `✅ *حظر @${target.split('@')[0]} اتشال*`, mentions: [target]
        }, { quoted: m });
    }

    // ===== قائمة المحظورين =====
    if (command === 'المحظورين' || command === 'banned') {
        const list = g.banned || [];
        if (!list.length) return m.reply('*✅ مفيش محظورين*');
        return conn.sendMessage(m.chat, {
            text: `🚫 *المحظورين (${list.length}):*\n\n` +
                  list.map((id, i) => `${i+1}. @${id.split('@')[0]}`).join('\n'),
            mentions: list
        }, { quoted: m });
    }
};

// ===== before hook: بيطرد المحظور لو دخل تاني =====
handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    const g = global._gs?.[m.chat];
    if (!g?.banned?.length) return false;
    if (isOwnerFn(m.sender, bot, conn)) return false;

    if (!isInList(g.banned, m.sender)) return false;

    const isBotAdminNow = await isBotActualAdmin(m.chat, conn).catch(() => m.isBotAdmin);
    if (!isBotAdminNow) return false;

    try {
        const res = await updateParticipant(m.chat, m.sender, 'remove', conn);
        if (res.ok) {
            await conn.sendMessage(m.chat, {
                text: `🚫 @${m.sender.split('@')[0]} اتشال تلقائي (محظور)`,
                mentions: [m.sender]
            });
        }
    } catch {}
    return true;
};

handler.command  = ['ban', 'unban', 'حظر', 'فك_حظر', 'المحظورين', 'banned'];
handler.usage    = ['ban @user', 'unban @user'];
handler.category = 'protection';
export default handler;
