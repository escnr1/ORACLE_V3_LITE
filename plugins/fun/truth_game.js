// ════════════════════════════════════════
//  truth_game.js - إدارة لعبة الصراحة
// ════════════════════════════════════════

import {
    getSession, setSession, delSession,
    createSession, currentPlayer,
    nextTurn, buildQuestionMsg, buildEndMsg
} from './truth_turns.js';
import { QUESTION_TYPES } from './truth_questions.js';

// مهلة اللعبة - 5 دقائق بدون تفاعل
const SESSION_TIMEOUT = 5 * 60 * 1000;

// جيب اسم لاعب
const getName = async (jid, conn, m) => {
    try {
        if (jid === m.sender && m.pushName) return m.pushName;
        if (typeof conn.getName === 'function') {
            const n = await conn.getName(jid).catch(() => null);
            if (n) return n;
        }
    } catch {}
    return jid.split('@')[0];
};

// ══ Main Handler ══
const handler = async (m, { conn, command, args, bot }) => {
    const jid     = m.sender;
    const chat    = m.chat;
    const isGroup = m.isGroup;

    switch (command) {

        // ─ بدء اللعبة ─
        case 'صراحة': case 'truth': case 'الصراحة': {

            // لو في جروب - لازم يمنشن اللاعبين
            if (isGroup) {
                const mentioned = m.mentionedJid || [];
                if (!mentioned.length) {
                    return conn.sendButton(m.chat, {
                        imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
                        bodyText:
                            `*🎯 لعبة الصراحة*\n\n` +
                            `العبها في الجروب مع أصحابك!\n\n` +
                            `*إزاي تبدأ:*\n` +
                            `*.صراحة @شخص1 @شخص2* ← ثنائي\n` +
                            `*.صراحة @1 @2 @3* ← ثلاثي\n` +
                            `*.صراحة @1 @2 @3 @4* ← رباعي\n\n` +
                            `أو في الخاص:\n` +
                            `*.صراحة* بس وهيبدأ معاك`,
                        footerText: 'ORACLE | لعبة الصراحة',
                        buttons: [
                            {
                                name: 'single_select',
                                params: {
                                    title: '🎮 اختار نوع اللعب',
                                    sections: [{
                                        title: 'طريقة اللعب',
                                        rows: [
                                            { title: '👥 ثنائي في الجروب',  description: 'منشن شخص واحد', id: '.صراحة_مساعدة ثنائي' },
                                            { title: '👥👥 ثلاثي في الجروب', description: 'منشن شخصين', id: '.صراحة_مساعدة ثلاثي' },
                                            { title: '💬 في الخاص',         description: 'ابعت للبوت', id: '.صراحة_مساعدة خاص' },
                                        ]
                                    }]
                                }
                            }
                        ],
                        interactiveConfig: { buttons_limits: 1 }
                    }, m).catch(() =>
                        m.reply(
                            `*🎯 لعبة الصراحة*\n\n` +
                            `منشن اللاعبين:\n` +
                            `*.صراحة @شخص1 @شخص2*\n\n` +
                            `من 2 لـ 4 لاعبين`
                        )
                    );
                }

                // تأكد من عدد اللاعبين (2-4)
                const players = [jid, ...mentioned.filter(p => p !== jid)].slice(0, 4);
                if (players.length < 2) return m.reply('*❌ محتاج لاعبين على الأقل يا معلم!*');
                if (players.length > 4) return m.reply('*❌ أقصى عدد 4 لاعبين*');

                // تحقق لو في جلسة شغالة
                if (getSession(chat)) {
                    return m.reply('*❌ في لعبة شغالة دلوقتي!\n*.إنهاء* لإنهاء اللعبة الحالية*');
                }

                const session = createSession(chat, players, 'group');

                // رسالة بدء اللعبة
                const names = await Promise.all(players.map(p => getName(p, conn, m)));
                const playersList = players.map((p, i) => `${i + 1}. @${p.split('@')[0]} (${names[i]})`).join('\n');

                await conn.sendMessage(chat, {
                    text:
                        `*🎯 بدأت لعبة الصراحة!*\n\n` +
                        `*اللاعبين:*\n${playersList}\n\n` +
                        `اختار نوع السؤال:\n` +
                        `*.عامة* ← 📚 أسئلة عامة\n` +
                        `*.شخصية* ← 💭 أسئلة شخصية\n` +
                        `*.جريئة* ← 🔥 أسئلة جريئة\n\n` +
                        `أو *.عشوائي* لسؤال عشوائي`,
                    contextInfo: { mentionedJid: players }
                }, { quoted: m });

            } else {
                // في الخاص - اللاعب بيلعب لوحده مع البوت
                if (getSession(chat)) {
                    return m.reply('*❌ في لعبة شغالة!\n*.إنهاء* لإنهاء اللعبة الحالية*');
                }

                const session = createSession(chat, [jid], 'private');

                await m.reply(
                    `*🎯 بدأت لعبة الصراحة في الخاص!*\n\n` +
                    `اختار نوع السؤال:\n\n` +
                    `📚 *.عامة* ← أسئلة عامة خفيفة\n` +
                    `💭 *.شخصية* ← أسئلة شخصية أعمق\n` +
                    `🔥 *.جريئة* ← أسئلة جريئة وجريئة\n` +
                    `🎲 *.عشوائي* ← سؤال عشوائي`
                );
            }
            break;
        }

        // ─ اختيار نوع السؤال ─
        case 'عامة': case 'شخصية': case 'جريئة': case 'عشوائي':
        case 'general': case 'personal': case 'daring': case 'random': {

            const session = getSession(chat);
            if (!session) return m.reply('*❌ مفيش لعبة شغالة!\n*.صراحة* للبدء*');

            // تحقق إن اللاعب الحالي هو اللي بيكتب
            if (isGroup && currentPlayer(session) !== jid) {
                return m.reply(`*❌ مش دورك!\nدور @${currentPlayer(session).split('@')[0]}*`);
            }

            // حدد نوع السؤال
            const typeMap = {
                'عامة': 'general', 'general': 'general',
                'شخصية': 'personal', 'personal': 'personal',
                'جريئة': 'daring', 'daring': 'daring',
                'عشوائي': ['general','personal','daring'][Math.floor(Math.random()*3)],
                'random':  ['general','personal','daring'][Math.floor(Math.random()*3)],
            };
            const type = typeMap[command] || 'general';

            // تحديث وقت آخر تفاعل
            session.lastActive = Date.now();

            const { text, mentions } = await buildQuestionMsg(session, type, conn);
            await conn.sendMessage(chat, { text, contextInfo: { mentionedJid: mentions } }, { quoted: m });
            break;
        }

        // ─ جواب - اللاعب جاوب ─
        case 'جواب': case 'answered': {
            const session = getSession(chat);
            if (!session) return;

            if (isGroup && currentPlayer(session) !== jid) return;

            // إضافة نقطة للاعب
            session.scores[jid] = (session.scores[jid] || 0) + 1;
            session.lastActive  = Date.now();

            const nextPlayer = nextTurn(session);

            await conn.sendMessage(chat, {
                text:
                    `*✅ تمام يا @${jid.split('@')[0]}!*\n\n` +
                    `دلوقتي دور @${nextPlayer.split('@')[0]}\n\n` +
                    `اختار نوع السؤال:\n` +
                    `*.عامة* ┃ *.شخصية* ┃ *.جريئة* ┃ *.عشوائي*`,
                contextInfo: { mentionedJid: [jid, nextPlayer] }
            }, { quoted: m });
            break;
        }

        // ─ تخطى - اللاعب رفض الإجابة ─
        case 'تخطى': case 'skip': {
            const session = getSession(chat);
            if (!session) return;
            if (isGroup && currentPlayer(session) !== jid) return;

            // خصم نقطة
            session.scores[jid] = (session.scores[jid] || 0) - 1;
            session.lastActive  = Date.now();

            const nextPlayer = nextTurn(session);

            await conn.sendMessage(chat, {
                text:
                    `*😅 @${jid.split('@')[0]} اختار يتخطى - خسر نقطة!*\n\n` +
                    `دلوقتي دور @${nextPlayer.split('@')[0]}\n\n` +
                    `اختار نوع السؤال:\n` +
                    `*.عامة* ┃ *.شخصية* ┃ *.جريئة* ┃ *.عشوائي*`,
                contextInfo: { mentionedJid: [jid, nextPlayer] }
            }, { quoted: m });
            break;
        }

        // ─ إنهاء اللعبة ─
        case 'إنهاء': case 'انهاء': case 'end_truth': {
            const session = getSession(chat);
            if (!session) return m.reply('*❌ مفيش لعبة شغالة دلوقتي*');

            // جيب أسماء اللاعبين
            const names = {};
            for (const p of session.players) {
                names[p] = await getName(p, conn, m);
            }

            const { text, mentions } = buildEndMsg(session, names);
            delSession(chat);

            await conn.sendMessage(chat, {
                text, contextInfo: { mentionedJid: mentions }
            }, { quoted: m });
            break;
        }

        // ─ مساعدة ─
        case 'صراحة_مساعدة': {
            return m.reply(
                `*🎯 لعبة الصراحة - المساعدة*\n\n` +
                `*في الجروب:*\n` +
                `*.صراحة @شخص1 @شخص2* ← ثنائي\n` +
                `*.صراحة @1 @2 @3* ← ثلاثي\n` +
                `*.صراحة @1 @2 @3 @4* ← رباعي\n\n` +
                `*في الخاص:*\n` +
                `*.صراحة* ← تلعب مع البوت\n\n` +
                `*أوامر اللعبة:*\n` +
                `*.عامة* ← سؤال عام\n` +
                `*.شخصية* ← سؤال شخصي\n` +
                `*.جريئة* ← سؤال جريء\n` +
                `*.عشوائي* ← سؤال عشوائي\n` +
                `*.جواب* ← لما تجاوب\n` +
                `*.تخطى* ← ترفض الإجابة\n` +
                `*.إنهاء* ← إنهاء اللعبة`
            );
        }
    }
};

// ─ before hook - تحقق من انتهاء مهلة الجلسة ─
handler.before = async (m, ctx, bot) => {
    const sessions = global._gs?.__truth;
    if (!sessions) return false;
    const now = Date.now();
    for (const [id, session] of Object.entries(sessions)) {
        if (session?.lastActive && now - session.lastActive > SESSION_TIMEOUT) {
            delete sessions[id];
            try {
                await ctx?.conn?.sendMessage?.(id, {
                    text: '*⏰ لعبة الصراحة خلصت لعدم النشاط*\n*.صراحة* عشان تلعب تاني'
                });
            } catch {}
        }
    }
    return false;
};

handler.usage    = ['صراحة', 'عامة', 'شخصية', 'جريئة', 'جواب', 'تخطى', 'إنهاء'];
handler.category = 'fun';
handler.command  = [
    'صراحة','truth','الصراحة',
    'عامة','شخصية','جريئة','عشوائي',
    'general','personal','daring','random',
    'جواب','answered','تخطى','skip',
    'إنهاء','انهاء','end_truth',
    'صراحة_مساعدة'
];

export default handler;
