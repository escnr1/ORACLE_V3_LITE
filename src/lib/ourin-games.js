// ════════════════════════════════════════
//  ourin-games.js — Compatibility shim
//  ⚠️ محرك ألعاب تخمين عام (سؤال/جواب) بيشتغل فعلياً، لكن بنك
//  الأسئلة اللي جواه بسيط/عام (مش نفس محتوى Riddle/تخمين الأفلام/
//  الأعلام الحقيقي من الأصل، لأنه مكانش موجود في الباتش). كل لعبة
//  من الـ 20+ لعبة (tebakbendera, tebakfilm...) هتشتغل بنفس المحرك
//  ده بنفس الشكل العام؛ يفضل استبدال بنك الأسئلة بمحتوى حقيقي لكل نوع.
// ════════════════════════════════════════
import { getDatabase } from './ourin-database.js';

const registry = {};
if (!global.__gameSessions) global.__gameSessions = new Map();

// بنك أسئلة عام مبدئي (نفس الأسئلة لأي نوع لعبة لحد ما يتحط بنك حقيقي)
const GENERIC_QUESTIONS = [
    { q: 'إيه اسم أكبر محيط في العالم؟', a: ['المحيط الهادي', 'الهادي', 'pacific'] },
    { q: 'كام عدد أيام السنة الكبيسة؟', a: ['366'] },
    { q: 'إيه عاصمة اليابان؟', a: ['طوكيو', 'tokyo'] },
    { q: 'كام لون في قوس قزح؟', a: ['7', 'سبعة'] },
    { q: 'إيه أسرع حيوان بري؟', a: ['الفهد', 'cheetah'] }
];

export const games = {
    register(name, meta) {
        registry[name] = { ...meta, name };
    },

    createPlugin(name) {
        const meta = registry[name] || { title: name, emoji: '🎮' };

        const config = {
            name,
            alias: meta.alias || [],
            category: 'game',
            description: meta.description || `لعبة ${meta.title}`,
            usage: `.${name}`,
            example: `.${name}`,
            isGroup: true,
            isPrivate: false,
            cooldown: 5,
            energi: 0,
            isEnabled: true
        };

        const handler = async (m, { sock }) => {
            const key = m.chat;
            if (global.__gameSessions.has(key)) {
                return m.reply(`⚠️ في لعبة شغالة بالفعل في الشات ده! جاوب عليها الأول أو اكتب *.stop*`);
            }
            const q = GENERIC_QUESTIONS[Math.floor(Math.random() * GENERIC_QUESTIONS.length)];
            global.__gameSessions.set(key, { game: name, answer: q.a, startedAt: Date.now() });
            return m.reply(`${meta.emoji || '🎮'} *${meta.title || name}*\n\n${q.q}\n\n_اكتب إجابتك في الشات_`);
        };

        const answerHandler = async (m) => {
            const session = global.__gameSessions.get(m.chat);
            if (!session || session.game !== name) return false;

            const guess = (m.text || m.body || '').trim().toLowerCase();
            const correct = session.answer.some(a => a.toLowerCase() === guess);

            if (correct) {
                global.__gameSessions.delete(m.chat);
                const db = getDatabase();
                db.updateKoin(m.sender, 500);
                db.updateExp(m.sender, 10);
                await m.reply(`✅ *إجابة صحيحة!* +500 كوين، +10 خبرة 🎉`);
                return true;
            }
            return false;
        };

        return { config, handler, answerHandler };
    }
};

export default { games };
