// ═══════════════════════════════════════
//  🎭 نظام التفاعل التلقائي - ORACLE
//  الأمر: .تفاعل_on / .تفاعل_off
// ═══════════════════════════════════════

const getG = (chatId) => {
    if (!global._gs)          global._gs = {};
    if (!global._gs[chatId])  global._gs[chatId] = {};
    return global._gs[chatId];
};

const EMOJIS = {
    love:    ['❤', '💋', '😍', '♥', '🫦'],
    warm:    ['🫩', '😳', '✅', '🫡', '🐥'],
    power:   ['⚜️', '👑', '⚡', '🔥', '💯'],
    fun:     ['😂', '🤣', '💀', '🥱', '🙃'],
    sad:     ['😥', '😪', '😢', '💔', '😞'],
    wow:     ['😱', '🙀', '🤩', '✨', '🎭'],
    neutral: ['🖐🏻', '🌚', '🙈', '🙊', '🙄'],
};

const CLASSIFIERS = {
    love:  ['حبيبي','حبيبتي','بحبك','عشقتك','جميل','حلو','رومانسي','قلب','عسل','حلوة','يجنن'],
    warm:  ['شكرا','مشكور','ربنا يجزيك','جزاك الله','ما شاء الله','برافو','احسنت','عاش','تمام','صح'],
    power: ['اوراكل','oracle','ملك','قوي','بطل','نار','جامد','عظيم','فحل','هيبة','كبير'],
    sad:   ['حزين','زهقت','تعبت','مش تمام','كئيب','وحيد','بكي','بكى','صعب','مؤلم'],
    wow:   ['صدق','مش معقول','اوف','واو','يا الله','سبحان الله','ده ايه'],
    fun:   ['هههه','خخخ','هاهاها','مضحك','كوميدي','غبي','عبيط','اتجنن'],
};

const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

const pickEmoji = (text) => {
    if (!text) return rnd(EMOJIS.neutral);
    const lower = text.toLowerCase();
    for (const [cat, words] of Object.entries(CLASSIFIERS)) {
        if (words.some(w => lower.includes(w))) return rnd(EMOJIS[cat]);
    }
    return rnd(Object.values(EMOJIS).flat());
};

const handler = async (m, { conn, command }) => {
    if (!m.isAdmin && !m.isOwner) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }
    if (!m.isGroup) {
        return m.reply('*♡ الأمر ده في الجروبات بس ♡*');
    }

    const g   = getG(m.chat);
    const cmd = command?.trim();

    if (cmd === 'تفاعل_on' || cmd === 'تفاعل-on') {
        g.autoReact = true;
        return conn.sendMessage(m.chat, {
            text: [
                '╭─┈─┈─┈─⟞🎭⟝─┈─┈─┈─╮',
                '┃  *✅ التفاعل التلقائي اتشغل*',
                '┃',
                '┃  البوت هيفاعل على رسايل الجروب',
                '┃  بإيموجي مناسب لكل رسالة 🤖',
                '╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯',
            ].join('\n'),
            mentions: [m.sender],
        }, { quoted: m });
    }

    if (cmd === 'تفاعل_off' || cmd === 'تفاعل-off') {
        delete g.autoReact;
        return conn.sendMessage(m.chat, {
            text: [
                '╭─┈─┈─┈─⟞🎭⟝─┈─┈─┈─╮',
                '┃  *❌ التفاعل التلقائي اتقفل*',
                '┃',
                '┃  البوت مش هيفاعل على الرسايل',
                '╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯',
            ].join('\n'),
            mentions: [m.sender],
        }, { quoted: m });
    }

    // .تفاعل بدون حاجة → الحالة
    const status = g.autoReact ? '✅ *شغال*' : '❌ *مقفول*';
    return m.reply(
        `╭─┈─┈─┈─⟞🎭⟝─┈─┈─┈─╮\n` +
        `┃  *نظام التفاعل التلقائي*\n` +
        `┃\n` +
        `┃  الحالة: ${status}\n` +
        `┃\n` +
        `┃  *.تفاعل_on*  ← تشغيل\n` +
        `┃  *.تفاعل_off* ← إيقاف\n` +
        `╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`
    );
};

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return false;
    const g = global._gs?.[m.chat] || {};
    if (!g.autoReact) return false;
    if (m.fromMe) return false;

    const body = m.body || m.text || '';
    const prefix = ['.', '/', '!'];
    if (prefix.some(p => body.startsWith(p))) return false;

    const msgType = m.type || '';
    const textTypes = ['conversation', 'extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage'];
    if (!textTypes.includes(msgType) && !body) return false;

    try {
        const emoji = pickEmoji(body);
        await conn.sendMessage(m.chat, {
            react: { text: emoji, key: m.key }
        });
    } catch {}

    return false;
};

handler.command  = ['تفاعل_on', 'تفاعل_off', 'تفاعل-on', 'تفاعل-off', 'تفاعل'];
handler.usage    = ['.تفاعل_on | .تفاعل_off'];
handler.admin    = true;
handler.category = 'admins';

export default handler;
