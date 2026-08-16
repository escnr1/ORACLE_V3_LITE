const DEFAULT_PIC = 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg';

const resolveName = async (m, jid, conn) => {
    try {
        if (jid === m.sender && m.pushName) return m.pushName;
        if (m.quoted?.sender === jid && m.quoted?.pushName) return m.quoted.pushName;
        if (typeof conn.getName === 'function') {
            const n = await conn.getName(jid).catch(() => null);
            if (n) return n;
        }
        if (conn.contacts?.[jid]?.notify) return conn.contacts[jid].notify;
        if (conn.contacts?.[jid]?.name)   return conn.contacts[jid].name;
    } catch {}
    return jid?.split('@')[0] || 'مجهول';
};

const getPic = async (conn, jid) => {
    try {
        const url = await conn.profilePictureUrl(jid, 'image');
        if (url && typeof url === 'string') return url;
    } catch {}
    return DEFAULT_PIC;
};

const handler = async (m, { conn, command }) => {

    // بروفايلي - صورة صاحب الأمر نفسه
    if (command === 'بروفايلي' || command === 'profileme') {
        const jid = m.sender;
        const pic = await getPic(conn, jid);
        const name = m.pushName || jid.split('@')[0];
        return conn.sendMessage(m.chat, {
            image: { url: pic },
            caption:
                `╭─┈─┈─⟞👑 بروفايلك⟝─┈─┈─╮\n` +
                `┃ 🏷️ الاسم: *${name}*\n` +
                `┃ 🆔 @${jid.split('@')[0]}\n` +
                `╰─┈─┈─⟞✅⟝─┈─┈─┈─┈─╯`,
            contextInfo: { mentionedJid: [jid] }
        }, { quoted: m });
    }

    // صورتي - نفس المنطق
    if (command === 'صورتي' || command === 'mypic' || command === 'mypicture') {
        const jid = m.sender;
        const pic = await getPic(conn, jid);
        return conn.sendMessage(m.chat, {
            image: { url: pic },
            caption:
                `╭─┈─┈─⟞🖼️ صورتك⟝─┈─┈─╮\n` +
                `┃ 👤 @${jid.split('@')[0]}\n` +
                `╰─┈─┈─⟞✅⟝─┈─┈─┈─╯`,
            contextInfo: { mentionedJid: [jid] }
        }, { quoted: m });
    }

    // بروفايل - منشن أو رد على حد تاني
    const target = m.mentionedJid?.[0] || m.quoted?.sender || null;
    if (!target) return m.reply('*📌 منشن العضو أو رد على رسالته*');
    const jid = target.includes('@') ? target : target + '@s.whatsapp.net';
    const pic = await getPic(conn, jid);
    const name = await resolveName(m, jid, conn);

    return conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─⟞👤 بروفايل العضو⟝─╮\n` +
            `┃ 🏷️ الاسم: *${name}*\n` +
            `┃ 🆔 @${jid.split('@')[0]}\n` +
            `╰─┈─┈─⟞✅⟝─┈─┈─┈─╯`,
        contextInfo: { mentionedJid: [jid] }
    }, { quoted: m });
};

handler.usage    = ['بروفايل', 'بروفايلي', 'صورتي'];
handler.category = 'tools';
handler.command  = ['بروفايل', 'profile', 'بروفايلي', 'profileme', 'صورتي', 'mypic', 'mypicture'];

export default handler;
