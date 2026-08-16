// مستويات الحماية
// Level 1: حماية عادية
// Level 2: حماية متوسطة
// Level 3: حماية صارمة
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const LEVELS = {
    1: { name: 'عادية 🟢', antiLink: false, antiSpam: true, antiBot: true, antiTag: false, antiFake: false, warnBeforeKick: true, maxWarnings: 3 },
    2: { name: 'متوسطة 🟡', antiLink: true, antiSpam: true, antiBot: true, antiTag: true, antiFake: true, warnBeforeKick: true, maxWarnings: 2 },
    3: { name: 'صارمة 🔴', antiLink: true, antiSpam: true, antiBot: true, antiTag: true, antiFake: true, warnBeforeKick: false, maxWarnings: 1 },
};

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');

    const g = getG(m.chat);

    if (command === 'security' || command === 'مستوى_الحماية') {
        const rawText = text?.trim();
        const level = rawText === '' || rawText === undefined ? NaN : parseInt(rawText);

        // عرض الحالة الحالية - متاح للكل (لما محدش يكتب رقم، أو الرقم مش من 0 لـ 3)
        if (rawText === undefined || rawText === '' || Number.isNaN(level) || level < 0 || level > 3) {
            const current = g.securityLevel || 0;
            return m.reply(
                `🛡️ *نظام الحماية*\n\n` +
                `المستوى الحالي: ${current ? LEVELS[current]?.name : 'مقفول'}\n\n` +
                `المستويات:\n` +
                `*.security 1* → حماية عادية 🟢\n` +
                `*.security 2* → حماية متوسطة 🟡\n` +
                `*.security 3* → حماية صارمة 🔴\n` +
                `*.security 0* → قفل الحماية`
            );
        }

        // تغيير المستوى - أدمن فقط
        await adminGuard(m, { conn, bot });
        if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

        if (level === 0) {
            g.securityLevel = null;
            g.antiLink = false;
            g.antiSpam = false;
            g.antiBot  = false;
            g.antiTag  = false;
            g.antiFake = false;
            return m.reply('✅ *نظام الحماية اتقفل*');
        }

        const cfg = LEVELS[level];
        g.securityLevel = level;
        g.antiLink  = cfg.antiLink  || null;
        g.antiSpam  = cfg.antiSpam  || null;
        g.antiBots  = cfg.antiBot   || null;
        g.antiTag   = cfg.antiTag   || null;
        g.antiFake  = cfg.antiFake  || null;
        g.maxWarnings = cfg.maxWarnings;
        g.strictMode  = level === 3 || null;

        await conn.sendMessage(m.chat, {
            text:
                `🛡️ *حماية ${cfg.name} اتشغلت*\n\n` +
                `🔗 مضاد الروابط: ${cfg.antiLink ? '✅' : '❌'}\n` +
                `📢 مضاد الإزعاج: ${cfg.antiSpam ? '✅' : '❌'}\n` +
                `🤖 مضاد البوتات: ${cfg.antiBot ? '✅' : '❌'}\n` +
                `🏷️ مضاد المنشن: ${cfg.antiTag ? '✅' : '❌'}\n` +
                `📵 مضاد الوهمي: ${cfg.antiFake ? '✅' : '❌'}\n` +
                `⚠️ حد الإنذارات: ${cfg.maxWarnings}\n` +
                `⚡ وضع صارم: ${level === 3 ? '✅ طرد على طول' : '❌'}`
        }, { quoted: m });
        return;
    }
};

handler.command  = ['security', 'مستوى_الحماية', 'حماية'];
handler.usage    = ['security 1/2/3'];
handler.category = 'protection';
export default handler;
