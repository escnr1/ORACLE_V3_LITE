// ترحيب وداع من قسم الحماية
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');

    await adminGuard(m, { conn, bot });
    if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

    const g = getG(m.chat);

    if (command === 'welcome' || command === 'ترحيب') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { delete g.welcomeDisabled; return m.reply('✅ *الترحيب اتشغل*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { g.welcomeDisabled = true; return m.reply('✅ *رسالة الترحيب اتقفلت*'); }
        return m.reply(`حالة الترحيب: ${g.welcomeDisabled ? '❌ مقفول' : '✅ شغال'}\n\n*.ترحيب تشغيل* أو *.ترحيب ايقاف*`);
    }

    if (command === 'goodbye' || command === 'وداع') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.goodbye = true; return m.reply('✅ *رسالة الخروج اتشغلت*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.goodbye; return m.reply('✅ *رسالة الخروج اتقفلت*'); }
        return m.reply(`حالة الوداع: ${g.goodbye ? '✅ شغال' : '❌ مقفول'}\n\n*.وداع تشغيل* أو *.وداع ايقاف*`);
    }
};

handler.command  = ['welcome', 'ترحيب', 'goodbye', 'وداع'];
handler.usage    = ['ترحيب تشغيل/ايقاف', 'وداع تشغيل/ايقاف'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
