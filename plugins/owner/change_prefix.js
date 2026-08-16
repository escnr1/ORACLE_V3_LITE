const handler = async (m, { conn, bot, text, args }) => {

    // لو مفيش text - يبعت طلب تحديد البريفكس
    if (!text?.trim()) {
        const current = (bot.config?.prefix || ['.', '/', '!']).join(' | ');
        try {
            return conn.sendButton(m.chat, {
                bodyText:
                    `*⚙️ تغيير البريفكس*\n\n` +
                    `البريفكس الحالي: *${current}*\n\n` +
                    `ابعت أي حاجة عايزها بريفكس\n` +
                    `(حرف، رمز، إيموجي)`,
                footerText: '𝐎𝐑𝐀𝐂𝐋𝐄 BOT',
                buttons: [
                    { name: 'quick_reply', params: { display_text: '⚙️ prefix .', id: '.prefix .' } },
                    { name: 'quick_reply', params: { display_text: '⚙️ prefix !', id: '.prefix !' } },
                    { name: 'quick_reply', params: { display_text: '⚙️ prefix /', id: '.prefix /' } },
                ],
                mentions: [m.sender],
                interactiveConfig: { buttons_limits: 3 }
            }, m);
        } catch {
            return m.reply(`*⚙️ البريفكس الحالي:* ${current}\n\nابعت البريفكس الجديد:\n*.prefix .*\n*.prefix 🫩*`);
        }
    }

    // تقسيم البريفكسات - يقبل أي حاجة حتى emoji
    const raw = text.trim();

    // لو في مسافات يعني أكتر من بريفكس
    // مثال: ".prefix . !" → ['.', '!']
    // مثال: ".prefix 🫩" → ['🫩']
    let newPrefix;

    if (raw.includes(' ')) {
        newPrefix = raw.split(/\s+/).filter(p => p.length > 0);
    } else {
        // كل الـ string = بريفكس واحد (حتى لو emoji)
        newPrefix = [raw];
    }

    if (!newPrefix.length) return m.reply('*❌ حدد البريفكس يا معلم*');

    // حفظ البريفكس
    bot.config.prefix = newPrefix;

    // حاول تحديث الـ commandSystem
    try {
        if (bot.commandSystem) {
            bot.commandSystem.prefix = newPrefix;
        }
    } catch {}

    // حفظ في global عشان يبقى بعد الريستارت
    global._customPrefix = newPrefix;

    await m.reply(
        `✅ *البريفكس اتغير*\n\n` +
        `الجديد: *${newPrefix.join(' | ')}*\n\n` +
        `> الأوامر دلوقتي بتبدأ بـ: ${newPrefix.join(' أو ')}`
    );
};

// before hook: لو حد بعت الـ prefix مباشرة يغير البريفكس
handler.before = async (m, { conn, bot }) => {
    // لو في pending prefix change
    if (!global._waitingPrefix) return false;
    if (global._waitingPrefix !== m.sender) return false;

    const text = (m.text || '').trim();
    if (!text) return false;

    delete global._waitingPrefix;

    const newPrefix = [text];
    bot.config.prefix = newPrefix;
    try { if (bot.commandSystem) bot.commandSystem.prefix = newPrefix; } catch {}
    global._customPrefix = newPrefix;

    await conn.sendMessage(m.chat, {
        text: `✅ *البريفكس اتغير لـ:* ${text}`
    }, { quoted: m });

    return true;
};

handler.command  = ['prefix', 'بريفكس', 'تغيير_البريفكس'];
handler.usage    = ['prefix .'];
handler.owner    = true;
handler.category = 'settings';
export default handler;
