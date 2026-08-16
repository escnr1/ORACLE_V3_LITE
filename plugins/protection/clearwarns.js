// أمر مسح كل الإنذارات - clearwarns / مسح_الانذارات
import { getG, canUseAdminCmd } from '../../system/admin_utils.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const g = getG(m.chat);
    g.warnings = {};
    return m.reply('✅ *كل الإنذارات اتمسحت*');
};

handler.command  = ['clearwarns', 'مسح_الانذارات'];
handler.usage    = ['clearwarns'];
handler.category = 'protection';

export default handler;
