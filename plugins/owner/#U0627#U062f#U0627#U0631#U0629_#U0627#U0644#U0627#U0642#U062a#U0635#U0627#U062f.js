const isOwner = (m, bot) => bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
const formatNumber = (n) => Number(n || 0).toLocaleString('en');

const handler = async (m, { conn, command, text, bot }) => {
    if (!isOwner(m, bot)) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات مش شغالة دلوقتي*');

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    const amountStr = (text || '').replace(/@\S+/g, '').trim();
    const amount = parseInt(amountStr, 10);

    if (!target) return m.reply('*⚠️ منشن الشخص المطلوب*\n> مثال: `اضافة_كوينز @الشخص 500`');
    if (!Number.isFinite(amount)) return m.reply('*⚠️ اكتب رقم صح*');

    const user = global.db.users[target] || {};
    const map = {
        'اضافة_كوينز':  { field: 'coins', delta: amount },
        'خصم_كوينز':    { field: 'coins', delta: -amount },
        'اضافة_خبرة':   { field: 'xp', delta: amount },
        'خصم_خبرة':     { field: 'xp', delta: -amount },
        'اضافة_مستوى':  { field: 'level', delta: amount },
        'خصم_مستوى':    { field: 'level', delta: -amount }
    };
    const op = map[command];
    if (!op) return;

    user[op.field] = Math.max(0, (Number(user[op.field]) || 0) + op.delta);
    global.db.users[target] = user;

    return conn.sendMessage(m.chat, {
        text: `*✅ حساب @${target.split('@')[0]} اتحدّث*\n┃ ${op.field}: ${formatNumber(user[op.field])}`,
        mentions: [target]
    }, { quoted: m });
};

handler.usage    = ['اضافة_كوينز', 'خصم_كوينز', 'اضافة_خبرة', 'خصم_خبرة', 'اضافة_مستوى', 'خصم_مستوى'];
handler.category = 'owner';
handler.command  = ['اضافة_كوينز', 'خصم_كوينز', 'اضافة_خبرة', 'خصم_خبرة', 'اضافة_مستوى', 'خصم_مستوى'];
handler.owner    = true;
handler.cooldown = 1500;

export default handler;
