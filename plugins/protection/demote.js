// أمر تنزيل الادمن - demote / تنزيل / خفض
import { isOwnerFn, canUseAdminCmd, updateParticipant } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown, notAdminMsg } from '../../system/bot_protection.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    
    await adminGuard(m, { conn, bot });
    
    const cooldown = checkCommandCooldown('demote', m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
    
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو يا معلم*');
    if (isOwnerFn(target, bot, conn)) return m.reply('*مـقِـدرش اسَـحـبَ الادمـن مـن مـطِـوَري「🐸」*');
    if (!m.isBotAdmin) return m.reply(notAdminMsg());

    const res = await updateParticipant(m.chat, target, 'demote', conn);
    if (res.ok) {
        return conn.sendMessage(m.chat, {
            text: `✅ *@${target.split('@')[0]} اتنزل من الادمن*`, mentions: [target]
        }, { quoted: m });
    }
    const msg = String(res.error?.message || res.error?.toString?.() || '').toLowerCase();
    const code = res.error?.output?.statusCode || res.error?.status;
    return m.reply(
        msg.includes('forbidden') || code === 403
            ? '*❌ البوت مش ادمن أو مش عنده صلاحية*'
            : '*❌ التنزيل مضربش*'
    );
};

handler.command  = ['demote', 'تنزيل', 'خفض'];
handler.usage    = ['demote'];
handler.category = 'protection';

export default handler;
