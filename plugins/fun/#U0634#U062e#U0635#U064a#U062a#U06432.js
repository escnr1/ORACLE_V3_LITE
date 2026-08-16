const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const bar = (percent) => {
    const filled = Math.round(percent / 10);
    return '▰'.repeat(filled) + '▱'.repeat(10 - filled);
};

const TRAITS2 = {
    'نسبة_كيوبوبريتي':   { emoji: '🎤', label: 'حب الكيبوب' },
    'نسبة_الويبو':        { emoji: '🍥', label: 'حب الأنمي (ويبو)' },
    'نسبة_محبتك_للألعاب': { emoji: '🎮', label: 'حب الألعاب' },
    'نسبة_ادمان_القرعة':  { emoji: '🎰', label: 'إدمان قرعات الألعاب' },
    'نسبة_بخلك':          { emoji: '🪙', label: 'البخل' },
    'نسبة_تقلب_مزاجك':    { emoji: '🎭', label: 'تقلب المزاج' }
};

const FOOTERS = [
    'ما تزعلش لو النتيجة مش عاجباك 😂',
    'دي مجرد نسبة عشوائية من عند البوت 🎲',
    'جرب تاني بعد شوية تشوف تتغير ولا لأ 😏'
];

const handler = async (m, { conn, command, text }) => {
    const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    const mention = `@${target.split('@')[0]}`;

    // اختبارات نسبة مئوية عادية
    if (TRAITS2[command]) {
        const trait = TRAITS2[command];
        const percent = rnd(1, 100);
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─⟞${trait.emoji}⟝─┈─┈─╮\n┃ *${trait.label}*\n┃ عند: ${mention}\n╰─┈─┈─⟞📊⟝─┈─┈─╯\n\n` +
                `${bar(percent)}  *${percent}%*\n\n_${pick(FOOTERS)}_`,
            mentions: [target]
        }, { quoted: m });
    }

    if (command === 'طولك_المتوقع') {
        const cm = rnd(150, 195);
        return conn.sendMessage(m.chat, {
            text: `📏 طولك المتوقع يا ${mention}: *${cm} سم*\n_تخمين عشوائي للتسلية فقط_`,
            mentions: [target]
        }, { quoted: m });
    }

    if (command === 'وزنك_المتوقع') {
        const kg = rnd(50, 110);
        return conn.sendMessage(m.chat, {
            text: `⚖️ وزنك المتوقع يا ${mention}: *${kg} كيلو*\n_تخمين عشوائي للتسلية فقط_`,
            mentions: [target]
        }, { quoted: m });
    }

    if (command === 'عمرك_المتوقع') {
        const age = rnd(15, 45);
        return conn.sendMessage(m.chat, {
            text: `🎂 عمرك المتوقع يا ${mention}: *${age} سنة*\n_تخمين عشوائي للتسلية فقط_`,
            mentions: [target]
        }, { quoted: m });
    }

    if (command === 'توافق_الحب') {
        const second = m.mentionedJid?.[1];
        const first = m.mentionedJid?.[0];
        if (!first || !second) {
            return m.reply('*⚠️ منشن شخصين عشان تشوف نسبة التوافق بينهم*\n> مثال: `توافق_الحب @شخص1 @شخص2`');
        }
        const percent = rnd(1, 100);
        const verdict = percent > 80 ? 'توافق خرافي! 💞' : percent > 50 ? 'توافق كويس 🙂' : percent > 20 ? 'توافق عادي 😐' : 'للأسف مفيش توافق كتير 😅';
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─⟞💘⟝─┈─┈─╮\n┃ *نسبة التوافق*\n╰─┈─┈─⟞💞⟝─┈─┈─╯\n\n` +
                `@${first.split('@')[0]} × @${second.split('@')[0]}\n\n` +
                `${bar(percent)}  *${percent}%*\n${verdict}\n\n_ده مجرد رقم عشوائي للتسلية_`,
            mentions: [first, second]
        }, { quoted: m });
    }
};

const allCommands = [...Object.keys(TRAITS2), 'طولك_المتوقع', 'وزنك_المتوقع', 'عمرك_المتوقع', 'توافق_الحب'];

handler.usage    = allCommands;
handler.category = 'fun';
handler.command  = allCommands;
handler.cooldown = 3000;

export default handler;
