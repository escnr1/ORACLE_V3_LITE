/**
 * safePlugin.js
 * غلاف أمان لكل plugin - يمنع أي خطأ من يوقف السيرفر
 * استخدام: استورده في command loader بتاعك
 */

/**
 * يلف handler بـ try/catch شاملة
 * @param {Function} fn - دالة الـ handler
 * @param {string}   name - اسم الـ plugin للـ logging
 */
export function safe(fn, name = 'unknown') {
    return async function (m, ctx) {
        try {
            return await fn(m, ctx);
        } catch (e) {
            const msg = e?.message || String(e);
            // مش بنطبع أخطاء الـ network العادية
            const ignore = ['ECONNRESET','ENOTFOUND','fetch failed','timed out','rate-overlimit','Connection Closed'];
            if (!ignore.some(x => msg.includes(x))) {
                console.error(`[Plugin:${name}]`, msg);
            }
            try {
                await m.reply?.(`❌ حصل خطأ في الأمر، جرب تاني`);
            } catch {}
        }
    };
}

export default safe;
