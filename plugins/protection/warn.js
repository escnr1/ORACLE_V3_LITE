// أمر الإنذار - warn / انذار / تحذير
import { isOwnerFn, canUseAdminCmd, addWarn } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown } from '../../system/bot_protection.js';

const handler = async (m, { conn, bot, text }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    
    await adminGuard(m, { conn, bot });
    
    const cooldown = checkCommandCooldown('warn', m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
    
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو يا معلم*');
    if (isOwnerFn(target, bot, conn)) return m.reply('*مـقِـدرش اسَـجل لمـطِـوَري انِـذار「🔥」*');

    await addWarn(m.chat, target, conn, text || 'مخالفة', bot);
};

handler.command  = ['warn', 'انذار', 'تحذير'];
handler.usage    = ['warn'];
handler.category = 'protection';

export default handler;
