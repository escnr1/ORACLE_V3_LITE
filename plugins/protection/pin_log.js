// تثبيت الرسائل وسجل المخالفات
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

    // تثبيت رسالة
    if (command === 'pin' || command === 'تثبيت') {
        const key = m.quoted?.key || m.key;
        try {
            await conn.sendMessage(m.chat, { pin: { type: 1, time: 86400 }, key });
            return m.reply('📌 *الرسالة اتثبتت*');
        } catch { return m.reply('*❌ التثبيت مضربش - اتأكد إن البوت ادمن*'); }
    }

    // إلغاء تثبيت
    if (command === 'unpin' || command === 'فك_تثبيت') {
        const key = m.quoted?.key || m.key;
        try {
            await conn.sendMessage(m.chat, { pin: { type: 2 }, key });
            return m.reply('📌 *الرساله بقت مش مثبتة*');
        } catch { return m.reply('*❌ إلغاء التثبيت مضربش*'); }
    }

    // تفعيل سجل المخالفات
    if (command === 'log' || command === 'سجل_الحماية') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.logMode = true; return m.reply('✅ *سجل المخالفات اتشغل*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.logMode; g.violations = []; return m.reply('✅ *السجل اتقفل*'); }
        return m.reply(`السجل: ${g.logMode ? '✅ شغال' : '❌ مقفول'}\n\n*.سجل_الحماية تشغيل* أو *.سجل_الحماية ايقاف*`);
    }

    // عرض السجل
    if (command === 'violations' || command === 'سجل_المخالفات') {
        const log = g.violations || [];
        if (!log.length) return m.reply('*📋 السجل فاضي*');
        const text2 = log.slice(0, 20).map((l, i) => `${i+1}. ${l}`).join('\n');
        return conn.sendMessage(m.chat, {
            text: `📋 *سجل المخالفات:*\n\n${text2}`
        }, { quoted: m });
    }

    // مسح السجل
    if (command === 'clearlog' || command === 'مسح_السجل') {
        g.violations = [];
        return m.reply('✅ *السجل اتمسح*');
    }

    // anti-newcomer
    if (command === 'anti-newcomer' || command === 'مضاد_الجدد') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.antiNewcomer = true; return m.reply('✅ *مضاد الحسابات الجديدة اتشغل*'); }
        if (val === 'off') { delete g.antiNewcomer; return m.reply('✅ *مضاد الحسابات الجديدة اتقفل*'); }
        return m.reply(`حالة مضاد الجدد: ${g.antiNewcomer ? '✅ شغال' : '❌ مقفول'}`);
    }

    // clearbans
    if (command === 'clearbans' || command === 'مسح_الحظر') {
        g.banned = [];
        return m.reply('✅ *قائمة المحظورين اتمسحت*');
    }
};

// before hook للسجل
handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    const g = global._gs?.[m.chat];
    if (!g?.logMode) return false;

    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner && !m.isAdmin) return false; // السجل للمراقبة فقط مش للمنع

    return false; // مش بيمنع، بس بيسجل
};

handler.command  = [
    'pin', 'unpin', 'تثبيت', 'فك_تثبيت',
    'log', 'سجل_الحماية', 'violations', 'سجل_المخالفات',
    'clearlog', 'مسح_السجل',
    'anti-newcomer', 'مضاد_الجدد', 'clearbans', 'مسح_الحظر'
];
handler.usage    = ['pin', 'unpin', 'log on/off', 'anti-newcomer on/off'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
