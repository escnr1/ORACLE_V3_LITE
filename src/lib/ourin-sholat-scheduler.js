// ourin-sholat-scheduler.js — Compatibility shim: تذكير مواقيت الصلاة التلقائي
import { getTodaySchedule, extractPrayerTimes } from './ourin-sholat-api.js';

let _timer = null;

export function initSholatScheduler(conn, jid, city) {
    stopSholatScheduler();
    _timer = setInterval(async () => {
        try {
            const schedule = await getTodaySchedule(city);
            const times = extractPrayerTimes(schedule);
            const now = new Date().toTimeString().slice(0, 5);
            for (const [name, time] of Object.entries(times)) {
                if (time === now) {
                    await conn.sendMessage(jid, { text: `🕌 دلوقتي موعد صلاة ${name}` }).catch(() => {});
                }
            }
        } catch {}
    }, 60 * 1000);
}

export function stopSholatScheduler() {
    if (_timer) { clearInterval(_timer); _timer = null; }
}

export default { initSholatScheduler, stopSholatScheduler };
