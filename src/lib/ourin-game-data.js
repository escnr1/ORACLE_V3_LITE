// ourin-game-data.js — Compatibility shim
// getRandomItem('truth.json') / getRandomItem('renungan.json')
const DATASETS = {
    'truth.json': [
        'ما هو أكثر شيء تخاف منه؟',
        'هل سبق وكذبت على صديق مقرب؟ ليه؟',
        'ما هو أغرب حلم شفته؟',
        'لو تقدر تغير حاجة في نفسك، هتغير إيه؟',
        'ما هو أكتر موقف محرج حصلك؟',
        'مين أكتر شخص أثر في حياتك؟',
        'هل عندك سر محدش يعرفه؟',
        'ما هو حلمك اللي عايز تحققه؟',
        'إيه أكتر حاجة نادم عليها؟',
        'لو تقدر تسافر لأي بلد دلوقتي، هتختار فين؟'
    ],
    'renungan.json': [
        'https://picsum.photos/seed/renungan1/800/800',
        'https://picsum.photos/seed/renungan2/800/800',
        'https://picsum.photos/seed/renungan3/800/800',
        'https://picsum.photos/seed/renungan4/800/800',
        'https://picsum.photos/seed/renungan5/800/800'
    ],
    'bucin.json': [
        'انت اللي خلاني أصدق في الحب تاني 💕',
        'كل يوم من غيرك بيبقى سنة عندي 🥺',
        'قلبي بيدق باسمك من غير إذن 💓',
        'مش عايز حاجة، عايزك انت بس 🥹',
        'ابتسامتك هي أحلى حاجة بشوفها في يومي ✨',
        'لو الدنيا كلها ضدي، انت كفاية عشاني 💞',
        'بحبك أكتر من أي حد قابلته في حياتي 💘',
        'وجودك جنبي بيخلي أي يوم وحش يبقى حلو 🌸'
    ],
    'dare.json': [
        'ابعت آخر صورة في الجاليري بتاعك',
        'قول أعلى صوتك عندك اسم حيوان لمدة 10 ثواني',
        'غيّر صورة البروفايل بحاجة مضحكة لمدة ساعة',
        'ابعت فويس نوت وانت بتغني',
        'اكتب أطرف حاجة حصلتلك من غير ما تقول التفاصيل',
        'ابعت آخر رسالة بعتها في شات تاني (من غير أسامي)',
        'قول 3 حاجات بتحبها في نفسك',
        'اعمل تحدي السكوت 5 دقايق جوه الجروب'
    ]
};

function resolve(key) {
    return Array.isArray(key) ? key : (DATASETS[key] || []);
}

export function getRandomItem(key) {
    const data = resolve(key);
    if (!data.length) return null;
    return data[Math.floor(Math.random() * data.length)];
}

// يرجع الداتاسيت كله (مصفوفة أو أوبجكت حسب الملف المطلوب).
export function getAllData(key) {
    return resolve(key);
}

// عنصر برقمه في الداتاسيت.
export function getItemByIndex(key, index) {
    const data = resolve(key);
    return data[index] ?? null;
}

// بحث بسيط بالنص جوه الداتاسيت (لو عناصره سترينج أو فيها اسم/name).
export function searchItem(key, query) {
    const data = resolve(key);
    const q = String(query || '').toLowerCase();
    return data.filter(item => {
        const text = typeof item === 'string' ? item : (item?.name || item?.title || JSON.stringify(item));
        return text.toLowerCase().includes(q);
    });
}

// ── إدارة جلسات الألعاب المؤقتة (زي family100 وأي لعبة تخمين تانية) ──
if (!global.__ourinGameSessions) global.__ourinGameSessions = new Map();
const sessions = global.__ourinGameSessions;

export function createSession(chatId, gameType, question, msgKey, durationMs) {
    const session = {
        gameType, question, msgKey,
        startedAt: Date.now(),
        endsAt: Date.now() + durationMs,
        timer: null
    };
    sessions.set(chatId, session);
    return session;
}

export function getSession(chatId) {
    return sessions.get(chatId) || null;
}

export function endSession(chatId) {
    const s = sessions.get(chatId);
    if (s?.timer) clearTimeout(s.timer);
    sessions.delete(chatId);
    return true;
}

export function hasActiveSession(chatId) {
    return sessions.has(chatId);
}

export function setSessionTimer(chatId, onTimeout) {
    const s = sessions.get(chatId);
    if (!s) return;
    const delay = Math.max(0, s.endsAt - Date.now());
    s.timer = setTimeout(onTimeout, delay);
}

export function getRemainingTime(chatId) {
    const s = sessions.get(chatId);
    if (!s) return 0;
    return Math.max(0, s.endsAt - Date.now());
}

export function formatRemainingTime(ms) {
    const sec = Math.ceil(ms / 1000);
    if (sec >= 60) return `${Math.floor(sec / 60)} دقيقة ${sec % 60} ثانية`;
    return `${sec} ثانية`;
}

const SURRENDER_WORDS = ['نيرحم', 'استسلم', 'استسلمت', 'menyerah', 'nyerah', 'surrender', 'give up'];
export function isSurrender(text) {
    return SURRENDER_WORDS.includes(String(text).toLowerCase().trim());
}

export function isReplyToGame(m, session) {
    return !!(session && m?.quoted?.id === session.msgKey?.id);
}

export const GAME_REWARD = { minExp: 10, maxExp: 30, minKoin: 500, maxKoin: 2000 };

export function getRandomReward() {
    const exp = Math.floor(Math.random() * (GAME_REWARD.maxExp - GAME_REWARD.minExp + 1)) + GAME_REWARD.minExp;
    const koin = Math.floor(Math.random() * (GAME_REWARD.maxKoin - GAME_REWARD.minKoin + 1)) + GAME_REWARD.minKoin;
    return { exp, koin };
}

// تلميح تدريجي: بيرجع أول حرف/حروف من إجابة لسه متتخمنتش.
export function getProgressiveHint(question, answered = []) {
    const remaining = (question?.jawaban || question?.answers || []).filter(
        a => !answered.includes(String(a).toLowerCase())
    );
    if (!remaining.length) return null;
    const pick = remaining[0];
    return `${String(pick)[0]}${'_'.repeat(Math.max(0, String(pick).length - 1))}`;
}

export default {
    getRandomItem, getAllData, getItemByIndex, searchItem,
    createSession, getSession, endSession, hasActiveSession, setSessionTimer,
    getRemainingTime, formatRemainingTime, isSurrender, isReplyToGame,
    GAME_REWARD, getRandomReward, getProgressiveHint
};
