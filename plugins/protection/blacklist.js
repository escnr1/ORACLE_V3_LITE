
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
    if (!g.blacklist) g.blacklist = [];

    if (command === 'blacklist' || command === 'قايمة_سوداء') {
        if (!text) {
            if (!g.blacklist.length) return m.reply('*📋 البلاك ليست فاضية*');
            return m.reply(`*🚫 الكلمات الممنوعة (${g.blacklist.length}):*\n\n${g.blacklist.map((w, i) => `${i+1}. ${w}`).join('\n')}`);
        }
        const [action, ...words] = text.trim().split(' ');
        const word = words.join(' ');

        if (action === 'add' || action === 'اضافه') {
            if (!word) return m.reply('*مثال:* .قايمة_سوداء اضافه كلمة');
            if (g.blacklist.includes(word)) return m.reply('*الكلمة موجودة أصلاً*');
            g.blacklist.push(word.toLowerCase());
            return m.reply(`✅ *اتضاف "${word}" للبلاك ليست*`);
        }

        if (action === 'remove' || action === 'حذف') {
            if (!word) return m.reply('*مثال:* .قايمة_سوداء حذف كلمة');
            g.blacklist = g.blacklist.filter(w => w !== word.toLowerCase());
            return m.reply(`✅ *"${word}" اتمسحت من البلاك ليست*`);
        }

        if (action === 'clear' || action === 'مسح') {
            g.blacklist = [];
            return m.reply('✅ *البلاك ليست اتمسحت*');
        }
    }

    if (command === 'anti-phone' || command === 'مضاد_ارقام') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.antiPhone = true; return m.reply('✅ *مضاد نشر الأرقام اتشغل*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.antiPhone; return m.reply('✅ *مضاد نشر الأرقام اتقفل*'); }
        return m.reply(`حالة مضاد الأرقام: ${g.antiPhone ? '✅ شغال' : '❌ مقفول'}`);
    }

    if (command === 'anti-forward' || command === 'مضاد_تحويل') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.antiForward = true; return m.reply('✅ *مضاد الإعادة اتشغل*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.antiForward; return m.reply('✅ *مضاد الإعادة اتقفل*'); }
        return m.reply(`حالة مضاد الإعادة: ${g.antiForward ? '✅ شغال' : '❌ مقفول'}`);
    }

    if (command === 'anti-curse' || command === 'مضاد_سب') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.antiCurse = true; return m.reply('✅ *مضاد الشتيمة اتشغل*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.antiCurse; return m.reply('✅ *مضاد الشتيمة اتقفل*'); }
        return m.reply(`حالة مضاد الشتيمة: ${g.antiCurse ? '✅ شغال' : '❌ مقفول'}`);
    }

    if (command === 'anti-flood' || command === 'مضاد_فيضان') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.antiFlood = true; return m.reply('✅ *مضاد الرسائل الطويلة اتشغل*'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.antiFlood; return m.reply('✅ *مضاد الرسائل الطويلة اتقفل*'); }
        return m.reply(`حالة مضاد الفيضان: ${g.antiFlood ? '✅ شغال' : '❌ مقفول'}`);
    }

    if (command === 'strict' || command === 'صارم') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on' || val === 'تشغيل') { g.strictMode = true; return m.reply('✅ *الوضع الصارم اتشغل*\n⚡ أي مخالفة = طرد على طول'); }
        if (val === 'off' || val === 'ايقاف' || val === 'إيقاف') { delete g.strictMode; return m.reply('✅ *الوضع الصارم اتقفل*'); }
        return m.reply(`الوضع الصارم: ${g.strictMode ? '✅ شغال' : '❌ مقفول'}`);
    }
};

handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    if (isOwner || m.isAdmin) return false;

    const g = global._gs?.[m.chat] || {};
    const text = (m.text || m.body || '').toLowerCase();

    if (g.blacklist?.length && text) {
        const found = g.blacklist.some(w => text.includes(w));
        if (found) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await conn.sendMessage(m.chat, {
                text: `🚫 @${m.sender.split('@')[0]} رسالتك فيها كلمة ممنوعة`,
                mentions: [m.sender]
            });
            return true;
        }
    }

    if (g.antiPhone) {
        const phoneRegex = /(\+\d{7,15}|\b0\d{9,14}\b)/g;
        if (phoneRegex.test(text)) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await conn.sendMessage(m.chat, {
                text: `📵 @${m.sender.split('@')[0]} ممنوع تنشر رقم تليفون`,
                mentions: [m.sender]
            });
            return true;
        }
    }

    if (g.antiForward && m.message?.extendedTextMessage?.contextInfo?.isForwarded) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
        await conn.sendMessage(m.chat, {
            text: `↩️ @${m.sender.split('@')[0]} ممنوع تعيد توجيه الرسايل`,
            mentions: [m.sender]
        });
        return true;
    }

    return false;
};

handler.command  = [
    'blacklist', 'قايمة_سوداء', 'anti-phone', 'مضاد_ارقام',
    'anti-curse', 'مضاد_سب', 'anti-flood', 'مضاد_فيضان', 'strict', 'صارم'
];
handler.usage    = ['blacklist add/remove/clear', 'anti-phone on/off', 'strict on/off'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
