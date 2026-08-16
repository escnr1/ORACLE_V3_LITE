// ════════════════════════════════════════
//  ourin-jadibot-manager.js — Compatibility shim
//  ⚠️ ملاحظة: ORACLE أصلاً عنده نظامه الخاص للبوتات الفرعية في
//  plugins/subs/sub.js. الشيم ده بيوفر بس واجهة قراءة بسيطة عشان
//  أوامر vonr اللي بتعرض/تدير قائمة الجلسات النشطة متكسرش، من غير
//  ما يدخل في تعارض مع نظام sub.js الحقيقي.
// ════════════════════════════════════════
if (!global.__jadibotSessions) global.__jadibotSessions = new Map();

export function getActiveJadibots() {
    return [...global.__jadibotSessions.values()].filter(s => s.active);
}

export function getAllJadibotSessions() {
    return [...global.__jadibotSessions.values()];
}

// وقف جلسة "جادي بوت" واحدة بالـ id/target بتاعها، مع خيار حذفها نهائي.
export async function stopJadibot(target, deleteSession = false) {
    const session = global.__jadibotSessions.get(target);
    if (!session) return { success: false, target };
    try { await session.sock?.end?.(); } catch {}
    if (deleteSession) global.__jadibotSessions.delete(target);
    else session.active = false;
    return { success: true, target, deleted: deleteSession };
}

// وقف كل الجلسات النشطة دفعة واحدة.
export async function stopAllJadibots() {
    let stopped = 0;
    for (const [target] of global.__jadibotSessions) {
        const r = await stopJadibot(target, false);
        if (r.success) stopped++;
    }
    return stopped;
}

export default { getActiveJadibots, getAllJadibotSessions, stopJadibot, stopAllJadibots };
