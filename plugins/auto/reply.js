// reply.js - نظام الردود التلقائية
// الردود الثابتة (default) + ردود ديناميكية تتضاف من أمر .اضف_رد

// ═══════════════════════════════
// الردود الثابتة الأصلية
// ═══════════════════════════════
const DEFAULT_TRIGGERS = {
    'سلام عليكم': ['*وعليكم السلام منور يغالي 🤎*', '*وعليكم السلام ورحمة الله وبركاته ❤️*'],
    'تست':        ['*موجود ي قلبي😍💋*'],
    'أوراكل':    ['*عوز مني اي🫩🖐🏻*'],
    'اوراكل':    ['*عوز مني اي🫩🖐🏻*'],
    'سلام':       ['*مع السلامة🖐🏻🐥*'],
    'هلا':        ['*هلا وغلا*', '*هلا بيك*', '*يا هلا*'],
    'يلا':        ['*خليك ي خي🥱🌚*', '*الله معاك👋🏻*'],
    'صباح الخير': ['*صباح النور*', '*صباح الورد*', '*صباح الفل*'],
    'مساء الخير': ['*مساء النور*', '*مساء الورد*', '*مساء الفل*', '*مساء الجوري*'],
    'مساء النور': ['*مساء الورد*', '*مساء الفل*', '*الله نورك*'],
};

// ═══════════════════════════════
// الردود الديناميكية (تتحفظ في global)
// ═══════════════════════════════
const getDynamic = () => {
    if (!global._gs) global._gs = {};
    if (!global._gs.__replies) global._gs.__replies = {};
    return global._gs.__replies;
};

// دمج الثابتة والديناميكية
const getAllTriggers = () => ({ ...DEFAULT_TRIGGERS, ...getDynamic() });

// ═══════════════════════════════
// before hook - بيشتغل على كل رسالة
// ═══════════════════════════════
export default async function before(m, { conn, bot }) {
    if (!m?.sender) return false;

    const sender  = m.sender;
    const isOwner = bot?.config?.owners?.some(o => sender === o.jid || sender === o.lid);
    const text    = (m.text || m.body || '').trim();
    const wizard  = global.__replyWizard || (global.__replyWizard = {});

    // ═══════════════════════════════════════
    // معالجة خطوات الـ wizard (مطور فقط)
    // ═══════════════════════════════════════
    if (isOwner && wizard[sender]) {
        const step = wizard[sender].step;

        // خطوة 1: استقبال الرسالة المُفعِّلة (trigger)
        if (step === 'trigger') {
            // تجاهل الأوامر
            const prefix = bot?.config?.prefix || '.';
            if (text.startsWith(prefix)) return false;

            wizard[sender].trigger = text;
            wizard[sender].step    = 'reply';

            await conn.sendMessage(m.chat, {
                text: `*✅ اتحفظ المُفعِّل:* "${text}"\n\n*الخطوة 2/2*\n📝 دلوقتي ابعت الرد اللي البوت هيقوله`
            }, { quoted: m });

            return true;
        }

        // خطوة 2: استقبال الرد
        if (step === 'reply') {
            const prefix = bot?.config?.prefix || '.';
            if (text.startsWith(prefix)) return false;

            const trigger     = wizard[sender].trigger;
            const replyText   = text;
            const dynamic     = getDynamic();

            // لو الـ trigger موجود بالفعل، أضف الرد للقائمة
            if (dynamic[trigger]) {
                if (!dynamic[trigger].includes(replyText)) {
                    dynamic[trigger].push(replyText);
                }
            } else {
                dynamic[trigger] = [replyText];
            }

            delete wizard[sender];

            await conn.sendMessage(m.chat, {
                text:
                    `⏳ *استنى بس، بضيف الرد...*`
            }, { quoted: m });

            await new Promise(r => setTimeout(r, 1500));

            await conn.sendMessage(m.chat, {
                text:
                    `╭─┈─┈─┈─⟞✅⟝─┈─┈─┈─╮\n` +
                    `┃ *الرد اتحفظ تمام!*\n` +
                    `╰─┈─┈─┈─⟞✅⟝─┈─┈─┈─╯\n\n` +
                    `📌 *المُفعِّل:* "${trigger}"\n` +
                    `💬 *الرد:* "${replyText}"\n\n` +
                    `دلوقتي لما حد يكتب "${trigger}" البوت هيرد تلقائياً ✨`
            }, { quoted: m });

            return true;
        }
    }

    // ═══════════════════════════════════════
    // الرد التلقائي على الرسائل العادية
    // ═══════════════════════════════════════
    const triggers = getAllTriggers();
    const replies  = triggers[text];

    if (replies?.length) {
        const pick = replies[Math.floor(Math.random() * replies.length)];
        await m.reply(pick);
    }

    return false;
}
