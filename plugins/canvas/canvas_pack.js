// ════════════════════════════════════════
//  قسم "التصميم" (canvas) - 10 أوامر
//  ملحوظة: مكتبة الصور (skia-canvas) معطلة عندك على السيرفر
//  فكل الأوامر هنا نصية 100% عشان محدش يوقع
//  ORACLE
// ════════════════════════════════════════

const handler = async (m, { command, text }) => {
    const t = (text || '').trim();
    const needText = () => m.reply('*⚠️ اكتب نص بعد الأمر يا فنان*');

    switch (command) {

        case 'اطار_اسم': {
            if (!t) return needText();
            return m.reply(`╔═══════════════╗\n   👑 *${t}* 👑\n╚═══════════════╝`);
        }

        case 'توقيع': {
            if (!t) return needText();
            return m.reply(`▬▬▬▬▬▬▬▬▬▬▬▬\n✦ ${t} ✦\n▬▬▬▬▬▬▬▬▬▬▬▬`);
        }

        case 'زخرفة_اسم': {
            if (!t) return needText();
            return m.reply(`彡${t.split('').join('')}彡\n『 ${t} 』\n▁ ▂ ▄ ▅ ${t} ▅ ▄ ▂ ▁`);
        }

        case 'اطار_رسالة': {
            if (!t) return needText();
            const lines = t.split('\n');
            const w = Math.max(...lines.map(l => l.length), 10);
            const top = '┏' + '━'.repeat(w + 2) + '┓';
            const bot = '┗' + '━'.repeat(w + 2) + '┛';
            const body = lines.map(l => `┃ ${l.padEnd(w)} ┃`).join('\n');
            return m.reply(`${top}\n${body}\n${bot}`);
        }

        case 'بار_تقدم': {
            const n = parseInt(t) || 50;
            const pct = Math.min(100, Math.max(0, n));
            const filled = Math.round(pct / 10);
            return m.reply(`⚡ *بار السيستم:*\n[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}] ${pct}%`);
        }

        case 'جدول_نصي': {
            const rows = t.split(',').map(s => s.trim()).filter(Boolean);
            if (rows.length < 2) return m.reply('*⚠️ اكتب عناصر مفصولة بفاصلة*\n_مثال:_ `.جدول_نصي اسم, نقاط, رتبة`');
            return m.reply(rows.map((r, i) => `┃ ${i + 1}. ${r}`).join('\n'));
        }

        case 'شعار_البوت': {
            return m.reply(
                `╔══════════════════╗\n` +
                `║   👑 𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓 👑   ║\n` +
                `╚══════════════════╝\n` +
                `        ⚡ سيستم شغال بلا إيرور ⚡`
            );
        }

        case 'كارت_ترحيب_نصي': {
            const name = t || m.pushName || 'صاحبي';
            return m.reply(
                `╭─❰ 🎉 أهلاً وسهلاً ❱─╮\n` +
                `│  إتفضل يا *${name}*\n` +
                `│  اتنور بيك المكان 🔥\n` +
                `╰────────────────────╯`
            );
        }

        case 'كارت_وداع_نصي': {
            const name = t || m.pushName || 'صاحبي';
            return m.reply(
                `╭─❰ 👋 مع السلامة ❱─╮\n` +
                `│  سلام يا *${name}*\n` +
                `│  البوت هيفتقدك 💔\n` +
                `╰──────────────────╯`
            );
        }

        case 'قالب_انجاز': {
            if (!t) return needText();
            return m.reply(`🏆 ═══════════════ 🏆\n   إنجاز جديد اتفتح!\n   ✨ ${t} ✨\n🏆 ═══════════════ 🏆`);
        }
    }
};

handler.usage = [
    'اطار_اسم <نص>','توقيع <نص>','زخرفة_اسم <نص>','اطار_رسالة <نص>','بار_تقدم <رقم من 0-100>',
    'جدول_نصي <عناصر,مفصولة,بفاصلة>','شعار_البوت','كارت_ترحيب_نصي [اسم]','كارت_وداع_نصي [اسم]','قالب_انجاز <نص>'
];
handler.category = 'canvas';
handler.command  = [
    'اطار_اسم','توقيع','زخرفة_اسم','اطار_رسالة','بار_تقدم',
    'جدول_نصي','شعار_البوت','كارت_ترحيب_نصي','كارت_وداع_نصي','قالب_انجاز'
];

export default handler;
