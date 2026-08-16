// أمر الترقية - promote / ترقيه / رفع
import { canUseAdminCmd, updateParticipant } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown, notAdminMsg } from '../../system/bot_protection.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    
    await adminGuard(m, { conn, bot });
    
    const cooldown = checkCommandCooldown('promote', m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
    
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو يا معلم*');
    if (!m.isBotAdmin) return m.reply(notAdminMsg());

    const res = await updateParticipant(m.chat, target, 'promote', conn);
    if (res.ok) {
        return conn.sendMessage(m.chat, {
            text: `👑 *@${target.split('@')[0]} اتدّى الادمن*`, mentions: [target]
        }, { quoted: m });
    }
    const msg = String(res.error?.message || res.error?.toString?.() || '').toLowerCase();
    const code = res.error?.output?.statusCode || res.error?.status;
    return m.reply(
        msg.includes('forbidden') || code === 403
            ? '*❌ البوت مش ادمن أو مش عنده صلاحية*'
            : '*❌ الترقية مضربت*'
    );
};

handler.command  = ['promote', 'ترقيه', 'رفع'];
handler.usage    = ['promote'];
handler.category = 'protection';

export default handler;
