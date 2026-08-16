// أمر إعفاء من الإنذار - unwarn / اعفاء / فك_انذار
import { getG, canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown } from '../../system/bot_protection.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    
    await adminGuard(m, { conn, bot });
    
    const cooldown = checkCommandCooldown('unwarn', m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
    
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو يا معلم*');

    const g = getG(m.chat);
    if (!g.warnings) g.warnings = {};
    g.warnings[target] = 0;

    return conn.sendMessage(m.chat, {
        text: `✅ *اتشال الإنذار عن @${target.split('@')[0]} من جميع الإنذارات*`,
        mentions: [target]
    }, { quoted: m });
};

handler.command  = ['unwarn', 'اعفاء', 'فك_انذار'];
handler.usage    = ['unwarn'];
handler.category = 'protection';

export default handler;
