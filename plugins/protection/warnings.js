// أمر عرض الإنذارات - warnings / انذارات
import { getG, canUseAdminCmd } from '../../system/admin_utils.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    const g = getG(m.chat);

    if (target) {
        const cnt = g.warnings?.[target] || 0;
        return conn.sendMessage(m.chat, {
            text: `📋 *إنذارات @${target.split('@')[0]}:* ${cnt}/${g.maxWarnings || 3}`,
            mentions: [target]
        }, { quoted: m });
    }

    const list = Object.entries(g.warnings || {}).filter(([, v]) => v > 0);
    if (!list.length) return m.reply('*✅ مفيش إنذارات*');

    const txt = list.map(([id, cnt]) =>
        `@${id.split('@')[0]}: ${'⚠️'.repeat(cnt)} (${cnt}/${g.maxWarnings || 3})`
    ).join('\n');

    return conn.sendMessage(m.chat, {
        text: `📋 *قائمة الإنذارات:*\n\n${txt}`,
        mentions: list.map(([id]) => id)
    }, { quoted: m });
};

handler.command  = ['warnings', 'انذارات'];
handler.usage    = ['warnings'];
handler.category = 'protection';

export default handler;
