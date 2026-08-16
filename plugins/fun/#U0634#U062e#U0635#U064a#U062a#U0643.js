// اختبارات شخصية عشوائية - نسبة مئوية لكل صفة
const TRAITS = {
    'نسبة_حلاوتي':      { emoji: '😍', label: 'الحلاوة' },
    'نسبة_وسامتي':      { emoji: '😎', label: 'الوسامة' },
    'نسبة_غبائي':       { emoji: '🤪', label: 'الغباء' },
    'نسبة_ذكائي':       { emoji: '🧠', label: 'الذكاء' },
    'نسبة_كسلي':        { emoji: '🦥', label: 'الكسل' },
    'نسبة_شقاوتي':      { emoji: '😈', label: 'الشقاوة' },
    'نسبة_طيبتي':       { emoji: '😇', label: 'الطيبة' },
    'نسبة_عصبيتي':      { emoji: '😡', label: 'العصبية' },
    'نسبة_رومانسيتي':   { emoji: '🥰', label: 'الرومانسية' },
    'نسبة_جدعنتي':      { emoji: '🫡', label: 'الجدعنة' },
    'نسبة_فلوسي':       { emoji: '💰', label: 'الغنى' },
    'نسبة_حظي':         { emoji: '🍀', label: 'الحظ' },
    'نسبة_عزوبيتي':     { emoji: '🙍', label: 'العزوبية' },
    'نسبة_جنوني':       { emoji: '🤯', label: 'الجنون' },
    'نسبة_خيانتي':      { emoji: '💔', label: 'الخيانة' },
    'نسبة_وفائي':       { emoji: '🤝', label: 'الوفاء' },
    'نسبة_نوميتي':      { emoji: '😴', label: 'النوم' },
    'نسبة_اكلي':        { emoji: '🍔', label: 'حب الأكل' },
    'نسبة_فبركتي':      { emoji: '🎭', label: 'الفبركة' },
    'نسبة_جرأتي':       { emoji: '🦁', label: 'الجرأة' },
    'نسبة_خجلي':        { emoji: '🙈', label: 'الخجل' },
    'نسبة_معاكستي':     { emoji: '😏', label: 'المعاكسة' },
    'نسبة_غيرتي':       { emoji: '😤', label: 'الغيرة' },
    'نسبة_كدبي':        { emoji: '🤥', label: 'الكدب' },
    'نسبة_صراحتي':      { emoji: '💯', label: 'الصراحة' },
    'نسبة_ابداعي':      { emoji: '🎨', label: 'الإبداع' },
    'نسبة_رياضتي':      { emoji: '⚽', label: 'حب الرياضة' },
    'نسبة_دراستي':      { emoji: '📚', label: 'حب الدراسة' },
    'نسبة_فضولي':       { emoji: '🔍', label: 'الفضول' },
    'نسبة_زعليتي':      { emoji: '🥺', label: 'سرعة الزعل' },
    'نسبة_قياديتي':     { emoji: '👑', label: 'الروح القيادية' },
    'نسبة_انطوائي':     { emoji: '🚪', label: 'الانطوائية' },
    'نسبة_اجتماعيتي':   { emoji: '🎉', label: 'الاجتماعية' },
    'نسبة_صبري':        { emoji: '⏳', label: 'الصبر' },
    'نسبة_عنادي':       { emoji: '🐐', label: 'العناد' }
};

const FOOTERS = [
    'ما تزعلش لو النتيجة مش عاجباك 😂',
    'دي مجرد نسبة عشوائية من عند البوت 🎲',
    'جرب تاني بعد شوية تشوف تتغير ولا لأ 😏',
    'شارك النتيجة مع أصحابك وشوف رأيهم 👀',
    'البوت بيقول اللي حاسس بيه بس 🤫'
];

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const bar = (percent) => {
    const filled = Math.round(percent / 10);
    return '▰'.repeat(filled) + '▱'.repeat(10 - filled);
};

const handler = async (m, { conn, command }) => {
    const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    const mention = `@${target.split('@')[0]}`;
    const trait = TRAITS[command];
    if (!trait) return;

    const percent = rnd(1, 100);

    await conn.sendMessage(m.chat, {
        text:
            `╭─┈─┈─⟞${trait.emoji}⟝─┈─┈─╮\n` +
            `┃ *${trait.label}*\n` +
            `┃ عند: ${mention}\n` +
            `╰─┈─┈─⟞📊⟝─┈─┈─╯\n\n` +
            `${bar(percent)}  *${percent}%*\n\n` +
            `_${pick(FOOTERS)}_`,
        mentions: [target]
    }, { quoted: m });
};

handler.usage    = Object.keys(TRAITS);
handler.category = 'fun';
handler.command  = Object.keys(TRAITS);
handler.cooldown = 3000;

export default handler;
