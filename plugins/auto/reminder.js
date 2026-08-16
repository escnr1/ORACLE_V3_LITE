// نظام التذكيرات
// نوعين:
// 1) وقت محدد:  .تذكير شرب الدواء 14:30
// 2) كل كام دقيقة: .تذكير الصلاة على النبي كل 30

const SALAWAT = [
    '🌹 *اللهم صلِّ على سيدنا محمد وعلى آله وصحبه وسلم*',
    '🌹 *صلوا على النبي ﷺ - اللهم صل وسلم وبارك على سيدنا محمد*',
    '🌹 *اللهم صلِّ على محمد وعلى آل محمد كما صليت على إبراهيم*',
    '🌹 *صلى الله عليه وسلم - أكثروا من الصلاة على النبي يوم الجمعة*',
    '🌹 *اللهم صلِّ وسلم وبارك على نبينا محمد ﷺ*',
];

const DUA = [
    '> _بسم الله الرحمن الرحيم_',
    '> _اللهم اجعل أعمالنا خالصة لوجهك الكريم_',
    '> _سبحان الله وبحمده سبحان الله العظيم_',
    '> _لا حول ولا قوة إلا بالله العلي العظيم_',
    '> _الحمد لله على كل حال_',
    '> _استغفر الله العظيم وأتوب إليه_',
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getReminders = () => {
    if (!global._gs) global._gs = {};
    if (!global._gs.__reminders) global._gs.__reminders = [];
    return global._gs.__reminders;
};

// تحليل وقت محدد "14:30" أو "8:00ص" أو "2:30م"
const parseTime = (str) => {
    if (!str) return null;
    const m = str.match(/^(\d{1,2}):(\d{2})([صم]?)$/);
    if (!m) return null;
    let h = parseInt(m[1]);
    let min = parseInt(m[2]);
    if (m[3] === 'م' && h < 12) h += 12;
    if (m[3] === 'ص' && h === 12) h = 0;
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return { h, min };
};

// بناء رسالة التذكير
const buildMsg = (r) => ({
    text:
        `╭─┈─┈─┈─⟞🔔⟝─┈─┈─┈─╮\n` +
        `┃ *تذكير ORACLE*\n` +
        `╰─┈─┈─┈─⟞🔔⟝─┈─┈─┈─╯\n\n` +
        (r.intervalMin
            ? `🔄 *كل ${r.intervalMin} دقيقة*\n\n`
            : `⏰ *${r.time}*\n\n`) +
        `📌 *${r.text}*\n\n` +
        `${getRandom(DUA)}\n\n` +
        `${getRandom(SALAWAT)}` +
        (r.sender ? `\n\n┃ @${r.sender.split('@')[0]}` : ''),
    mentions: r.sender ? [r.sender] : []
});

// ===== Handler =====
const handler = async (m, { conn, text, command }) => {

    // عرض التذكيرات
    if (command === 'تذكيراتي' ||
        (command === 'تذكير' && ['قائمة','قائمه','list'].includes(text?.trim()))) {
        const all = getReminders().filter(r => r.chat === m.chat);
        if (!all.length) return m.reply(
            '*📋 مفيش تذكيرات حالياً*\n\n' +
            'أمثلة:\n' +
            '*.تذكير شرب الدواء 14:30*\n' +
            '*.تذكير الصلاة على النبي كل 30*'
        );
        const lines = all.map((r, i) =>
            `${i+1}. ${r.intervalMin ? `🔄 كل ${r.intervalMin}د` : `⏰ ${r.time}`}\n   📌 ${r.text}`
        ).join('\n\n');
        return m.reply(`*🔔 التذكيرات:*\n\n${lines}\n\n*.تذكير حذف <رقم>*`);
    }

    // حذف تذكير
    if (command === 'تذكير' && text?.trim().startsWith('حذف')) {
        const num = parseInt(text.trim().split(/\s+/)[1]);
        const chatR = getReminders().filter(r => r.chat === m.chat);
        if (!num || !chatR[num-1]) return m.reply('*❌ رقم غلط* — استخدم *.تذكيراتي*');
        const target = chatR[num-1];
        // لو عنده interval، وقفه
        if (target._intervalId) {
            clearInterval(target._intervalId);
        }
        global._gs.__reminders = getReminders().filter(r => r.id !== target.id);
        return m.reply(`*✅ اتمسح:* ${target.text}`);
    }

    // مسح الكل
    if (command === 'تذكير' && ['مسح','clear'].includes(text?.trim())) {
        const mine = getReminders().filter(r => r.chat === m.chat);
        mine.forEach(r => { if (r._intervalId) clearInterval(r._intervalId); });
        global._gs.__reminders = getReminders().filter(r => r.chat !== m.chat);
        return m.reply(`*✅ اتمسح ${mine.length} تذكير*`);
    }

    // ===== إضافة تذكير جديد =====
    if (command === 'تذكير') {
        if (!text?.trim()) return m.reply(
            '*🔔 أمر التذكير*\n\n' +
            '*وقت محدد:*\n.تذكير شرب الدواء 14:30\n\n' +
            '*كل كام دقيقة:*\n.تذكير الصلاة على النبي كل 30\n\n' +
            '*.تذكيراتي* — عرض التذكيرات\n' +
            '*.تذكير حذف 1* — حذف برقمه\n' +
            '*.تذكير مسح* — مسح الكل'
        );

        const parts = text.trim().split(/\s+/);

        // ─ نوع "كل X دقيقة" ─
        const kelIdx = parts.findIndex(p => p === 'كل');
        if (kelIdx !== -1 && parts[kelIdx + 1]) {
            const mins = parseInt(parts[kelIdx + 1]);
            if (!mins || mins < 1 || mins > 1440) {
                return m.reply('*❌ عدد الدقائق غلط* (بين 1 و 1440)');
            }

            const reminderText = parts.slice(0, kelIdx).join(' ');
            if (!reminderText) return m.reply('*❌ اكتب نص التذكير قبل كلمة كل*');

            const reminder = {
                id:          `${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
                chat:        m.chat,
                sender:      m.sender,
                text:        reminderText,
                intervalMin: mins,
                nextAt:      Date.now() + mins * 60_000,
                addedAt:     Date.now(),
            };

            getReminders().push(reminder);

            // interval محمي من التكرار باستخدام global key
            const intervalKey = `__ri_${reminder.id}`;
            if (!global[intervalKey]) {
                global[intervalKey] = setInterval(async () => {
                    const conn2 = global._conn;
                    if (!conn2) return;
                    const still = getReminders().find(r => r.id === reminder.id);
                    if (!still) {
                        clearInterval(global[intervalKey]);
                        delete global[intervalKey];
                        return;
                    }
                    try {
                        const { text: t, mentions } = buildMsg(still);
                        await conn2.sendMessage(still.chat, { text: t, contextInfo: { mentionedJid: mentions } });
                    } catch {}
                }, mins * 60_000);
            }

            return m.reply(
                `*✅ اتسجل التذكير!*\n\n` +
                `📌 *${reminderText}*\n` +
                `🔄 *كل ${mins} دقيقة*\n\n` +
                `${getRandom(SALAWAT)}`
            );
        }

        // ─ نوع وقت محدد ─
        const timeStr = parts[parts.length - 1];
        const parsed  = parseTime(timeStr);

        if (!parsed) {
            return m.reply(
                '*❌ صيغة الوقت غلط*\n\n' +
                'أمثلة:\n' +
                '*.تذكير شرب الدواء 14:30*\n' +
                '*.تذكير الصلاة على النبي كل 30*'
            );
        }

        const reminderText = parts.slice(0, -1).join(' ');
        if (!reminderText) return m.reply('*❌ اكتب نص التذكير قبل الوقت*');

        const reminder = {
            id:      `${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
            chat:    m.chat,
            sender:  m.sender,
            text:    reminderText,
            time:    timeStr,
            h:       parsed.h,
            min:     parsed.min,
            addedAt: Date.now(),
        };

        getReminders().push(reminder);

        return m.reply(
            `*✅ اتسجل التذكير!*\n\n` +
            `📌 *${reminderText}*\n` +
            `⏰ *${timeStr}*\n\n` +
            `${getRandom(SALAWAT)}`
        );
    }
};

// ===== before hook: فحص التذكيرات بالوقت المحدد (مش الـ interval) =====
handler.before = async (m, { conn }) => {
    if (!global._conn) global._conn = conn;

    const now  = Date.now();
    const last = global.__lastReminderCheck || 0;
    if (now - last < 30_000) return false;
    global.__lastReminderCheck = now;

    const reminders = getReminders().filter(r => r.h !== undefined); // وقت محدد فقط
    if (!reminders.length) return false;

    const curH   = new Date().getHours();
    const curMin = new Date().getMinutes();
    const fired  = [];

    for (const r of reminders) {
        if (r.h !== curH || r.min !== curMin) continue;
        const key = `${r.id}_${curH}_${curMin}`;
        if (global.__firedReminders?.[key]) continue;

        try {
            const { text: t, mentions } = buildMsg(r);
            await conn.sendMessage(r.chat, { text: t, contextInfo: { mentionedJid: mentions } });
        } catch {}

        if (!global.__firedReminders) global.__firedReminders = {};
        global.__firedReminders[key] = now;
        fired.push(r.id);
    }

    if (fired.length) {
        global._gs.__reminders = getReminders().filter(r => !fired.includes(r.id));
    }

    // تنظيف
    if (global.__firedReminders) {
        for (const [k, t] of Object.entries(global.__firedReminders)) {
            if (now - t > 7_200_000) delete global.__firedReminders[k];
        }
    }

    return false;
};

handler.command  = ['تذكير', 'تذكيراتي', 'reminder'];
handler.usage    = ['تذكير <نص> <وقت>', 'تذكير <نص> كل <دقائق>'];
handler.category = 'auto';

export default handler;
