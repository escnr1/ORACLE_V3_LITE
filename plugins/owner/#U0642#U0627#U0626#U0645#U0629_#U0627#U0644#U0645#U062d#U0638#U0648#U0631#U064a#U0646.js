const isOwner = (m, bot) => bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);

const handler = async (m, { conn, bot }) => {
    if (!isOwner(m, bot)) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات مش شغالة دلوقتي*');

    const banned = Object.entries(global.db.users)
        .filter(([, u]) => u?.banned)
        .map(([id]) => id);

    if (banned.length === 0) return m.reply('*✅ مفيش حد محظور دلوقتي*');

    const txt =
        `╭─┈─┈─⟞🚫⟝─┈─┈─╮\n┃ *المحظورين (${banned.length})*\n╰─┈─┈─⟞📋⟝─┈─┈─╯\n\n` +
        banned.map((j, i) => `${i + 1}. @${j.split('@')[0]}`).join('\n');

    return conn.sendMessage(m.chat, { text: txt, mentions: banned }, { quoted: m });
};

handler.usage    = ['قائمة_المحظورين'];
handler.category = 'owner';
handler.command  = ['قائمة_المحظورين'];
handler.owner    = true;
handler.cooldown = 2000;

export default handler;
