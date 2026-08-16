import { numOf } from '../../system/admin_utils.js';

const ff = async (m, { conn, args, command }) => {
    const raw = args[0];

    if (!raw) {
        return m.reply(`*⚠️ اكتب الرقم كده:*\n> .${command} 201xxxxxxxxx`);
    }

    const num = numOf(raw.replace(/[+\s-]/g, ''));

    if (!num || !/^\d{8,15}$/.test(num)) {
        return m.reply(`*❌ الرقم ده مش صح، ابعته من غير رموز كده:*\n> .${command} 201xxxxxxxxx`);
    }

    const jid = `${num}@s.whatsapp.net`;
    const user = global.db.users[jid] || {};

    const isUnblock = command === "فك_بلوك";

    if (isUnblock) {
        if (!user.banned) {
            return m.reply(`*❌ الرقم ${num} مش متبلوك أصلاً*`);
        }
        delete user.banned;
        return m.reply(`*✅ ~ اتفك البلوك عن الرقم ${num}*\n> *_دلوقت يقدر ينصب ويستخدم البوت عادي_*`);
    }

    if (user.banned) {
        return m.reply(`*❌ الرقم ${num} متبلوك أصلاً*`);
    }

    user.banned = true;
    return m.reply(`*✅ ~ اتبلوك الرقم ${num}*\n> *_مش هيقدر ينصب ولا يستخدم البوت خالص_*`);
};

ff.usage = ["بلوك", "فك_بلوك"];
ff.category = "owner";
ff.command = ["بلوك", "فك_بلوك"];
ff.owner = true;

export default ff;
