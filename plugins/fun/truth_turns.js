// ════════════════════════════════════════
//  truth_turns.js - نظام الأدوار
// ════════════════════════════════════════

import { getQuestion, QUESTION_TYPES } from './truth_questions.js';

// DB الجلسات
const getSessions = () => {
    if (!global._gs)               global._gs = {};
    if (!global._gs.__truth)       global._gs.__truth = {};
    return global._gs.__truth;
};

export const getSession = (id) => getSessions()[id] || null;
export const setSession = (id, data) => { getSessions()[id] = data; };
export const delSession = (id) => { delete getSessions()[id]; };

// إنشاء جلسة جديدة
export const createSession = (id, players, mode) => {
    const session = {
        id,
        players,       // array of jids
        mode,          // 'group' | 'private'
        currentIdx: 0, // index اللاعب الحالي
        round: 1,
        active: true,
        createdAt: Date.now(),
        scores: Object.fromEntries(players.map(p => [p, 0])),
        usedQuestions: [], // الأسئلة المستخدمة بالفعل - لمنع التكرار
    };
    setSession(id, session);
    return session;
};

// اللاعب الحالي
export const currentPlayer = (session) =>
    session.players[session.currentIdx % session.players.length];

// الانتقال للدور الجاي
export const nextTurn = (session) => {
    session.currentIdx++;
    if (session.currentIdx % session.players.length === 0) session.round++;
    return currentPlayer(session);
};

// بناء رسالة السؤال
export const buildQuestionMsg = async (session, type, conn) => {
    const player   = currentPlayer(session);
    const question = getQuestion(type, session.usedQuestions);
    session.usedQuestions = session.usedQuestions || [];
    session.usedQuestions.push(question);

    const typeInfo = QUESTION_TYPES[type];
    const total    = session.players.length;
    const round    = session.round;

    // جيب اسم اللاعب
    let name = player.split('@')[0];
    try {
        if (typeof conn.getName === 'function') {
            const n = await conn.getName(player).catch(() => null);
            if (n) name = n;
        }
    } catch {}

    return {
        text:
            `╭──────────────────╮\n` +
            `┃ 🎯 *لعبة الصراحة*\n` +
            `┃ الجولة ${round} - دور ${(session.currentIdx % total) + 1}/${total}\n` +
            `╰──────────────────╯\n\n` +
            `👤 *دور:* @${player.split('@')[0]}\n\n` +
            `${typeInfo.emoji} *سؤال ${typeInfo.label}:*\n` +
            `_${question}_\n\n` +
            `━━━━━━━━━━━━━━━\n` +
            `*.جواب* لما تجاوب\n` +
            `*.تخطى* لو مش عايز تجاوب (بتخسر نقطة)\n` +
            `*.إنهاء* لإنهاء اللعبة`,
        mentions: [player],
    };
};

// بناء نتيجة نهاية اللعبة
export const buildEndMsg = (session, names = {}) => {
    const sorted = Object.entries(session.scores)
        .sort(([,a],[,b]) => b - a);
    const medals = ['🥇','🥈','🥉'];
    const lines  = sorted.map(([jid, score], i) => {
        const n = names[jid] || jid.split('@')[0];
        return `${medals[i] || '▪️'} @${jid.split('@')[0]} (${n}) - ${score} نقطة`;
    });
    return {
        text:
            `╭──────────────────╮\n` +
            `┃ 🏁 *اللعبة خلصت!*\n` +
            `╰──────────────────╯\n\n` +
            `*النتائج النهائية:*\n\n` +
            lines.join('\n') + '\n\n' +
            `الجولات: ${session.round - 1}\n` +
            `*.صراحة* للعب مرة تانية`,
        mentions: session.players,
    };
};

const handler = async () => {};
handler.command  = [];
handler.category = 'fun';
export default handler;
