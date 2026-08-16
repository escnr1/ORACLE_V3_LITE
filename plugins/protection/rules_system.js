// نظام القوانين
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');

    const g = getG(m.chat);

    // عرض القوانين - متاح لكل الأعضاء
    if (command === 'rules' || command === 'قوانين') {
        if (!g.rules) return m.reply('*❌ لسه مفيش قوانين متحطة*\nاستخدم: .setrules');
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─┈─⟞📜⟝─┈─┈─┈─╮\n` +
                `┃ *قوانين الجروب*\n` +
                `╰─┈─┈─┈─⟞📜⟝─┈─┈─┈─╯\n\n` +
                `${g.rules}\n\n` +
                `> _اللي يخالف القوانين هيتعامل معاه حسب لوائح الجروب_`
        }, { quoted: m });
    }

    // تعيين القوانين - أدمن فقط
    if (command === 'setrules' || command === 'قوانين_تعيين') {
        await adminGuard(m, { conn, bot });
        if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

        if (!text) return m.reply('*مثال:* .setrules 1. لا شتم\n2. لا روابط');
        g.rules = text.trim();
        return m.reply('✅ *قوانين الجروب اتحطت*');
    }
};

handler.command  = ['setrules', 'rules', 'قوانين', 'قوانين_تعيين'];
handler.usage    = ['setrules', 'rules'];
handler.category = 'protection';
export default handler;
