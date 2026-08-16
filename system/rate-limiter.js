/**
 * نظام Rate Limiting عام للبوت
 * يمنع الإرسال السريع اللي بيسبب حظر واتساب
 */

const userCooldowns  = new Map(); // per user
const chatCooldowns  = new Map(); // per chat
const globalCounter  = { count: 0, resetAt: Date.now() + 60000 };

const LIMITS = {
    userMs:    3000,   // مستخدم واحد: أمر كل 3 ثواني
    chatMs:    1500,   // جروب: رسالة كل 1.5 ثانية
    globalRpm: 80,     // البوت كله: 80 رسالة في الدقيقة
};

/**
 * @returns { allowed: bool, waitMs: number }
 */
export const checkLimit = (userId, chatId) => {
    const now = Date.now();

    // reset global counter كل دقيقة
    if (now > globalCounter.resetAt) {
        globalCounter.count  = 0;
        globalCounter.resetAt = now + 60000;
    }

    // global rpm
    if (globalCounter.count >= LIMITS.globalRpm) {
        return { allowed: false, waitMs: globalCounter.resetAt - now };
    }

    // per user
    const lastUser = userCooldowns.get(userId) || 0;
    if (now - lastUser < LIMITS.userMs) {
        return { allowed: false, waitMs: LIMITS.userMs - (now - lastUser) };
    }

    // per chat
    const lastChat = chatCooldowns.get(chatId) || 0;
    if (now - lastChat < LIMITS.chatMs) {
        return { allowed: false, waitMs: LIMITS.chatMs - (now - lastChat) };
    }

    // كل حاجة تمام
    userCooldowns.set(userId, now);
    chatCooldowns.set(chatId, now);
    globalCounter.count++;

    return { allowed: true, waitMs: 0 };
};

// تنظيف الـ maps كل 10 دقايق عشان ما تاكلش memory
setInterval(() => {
    const now = Date.now();
    for (const [k, v] of userCooldowns) {
        if (now - v > 60000) userCooldowns.delete(k);
    }
    for (const [k, v] of chatCooldowns) {
        if (now - v > 60000) chatCooldowns.delete(k);
    }
}, 600000);

export default { checkLimit, LIMITS };
