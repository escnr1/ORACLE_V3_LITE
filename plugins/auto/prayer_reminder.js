import { readFileSync, existsSync } from 'fs';
import { writeFileSync } from 'fs';

const ADHAN_FILE = './system/adhan_config.json';
let lastNotified = {};

const loadConfig = () => {
    try { return existsSync(ADHAN_FILE) ? JSON.parse(readFileSync(ADHAN_FILE, 'utf-8')) : {}; } catch { return {}; }
};

const getPrayerTimes = async (city) => {
    const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=4`,
        { signal: AbortSignal.timeout(10000) }
    );
    const data = await res.json();
    if (data.code !== 200) throw new Error('not found');
    return data.data.timings;
};

const PRAYER_LABELS = {
    Fajr: '🌅 الفجر', Dhuhr: '🌞 الظهر',
    Asr: '🌤️ العصر', Maghrib: '🌆 المغرب', Isha: '🌙 العشاء'
};

// بيشتغل كل 60 ثانية
// 🛡️ حماية من التكرار: لو الـ plugin watcher (chokidar) أعاد تحميل الملف ده
// (مثلاً بعد أي حفظ/تعديل، حتى لغير هذا الملف بنفسه) من غير الحماية دي كان
// هيتسجل interval جديد فوق القديم كل مرة، وبعد فترة عشوائية يتراكموا
// عشرات الـ intervals الشغالة في نفس الوقت (كل واحد بيعمل HTTP request كل
// دقيقة)، وده يستهلك الميموري والاتصالات المفتوحة لحد ما نظام التشغيل
// (مش Node.js) يقتل الـ process فجأة بدون أي exception يتسجل في اللوج
if (!global.__prayerReminderInterval) {
    global.__prayerReminderInterval = setInterval(async () => {
        const cfg = loadConfig();
        if (!Object.keys(cfg).length) return;

        const now = new Date();
        const hh = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hh}:${mm}`;

        for (const [chatId, chatCfg] of Object.entries(cfg)) {
            if (!chatCfg.active || !chatCfg.city) continue;

            try {
                const times = await getPrayerTimes(chatCfg.city);

                for (const [prayer, label] of Object.entries(PRAYER_LABELS)) {
                    const pTime = times[prayer]?.slice(0, 5); // HH:MM
                    if (!pTime || pTime !== currentTime) continue;

                    const notifyKey = `${chatId}_${prayer}_${currentTime}`;
                    if (lastNotified[notifyKey]) continue;
                    lastNotified[notifyKey] = true;

                    // أرسل تذكير الصلاة
                    const conn = global._conn;
                    if (!conn) continue;

                    await conn.sendMessage(chatId, {
                        text:
                            `🕌 *حان وقت صلاة ${label}*\n\n` +
                            `📍 ${chatCfg.city}\n` +
                            `⏰ ${pTime}\n\n` +
                            `> _اللهم أعنا على ذكرك وشكرك وحسن عبادتك_ 🤲`
                    });

                    // قفل الجروب لو مفعل
                    if (chatCfg.lockGroup && prayer !== 'Fajr') {
                        try {
                            await conn.groupSettingUpdate(chatId, 'announcement');
                            await conn.sendMessage(chatId, {
                                text: `🔒 *الجروب اتقفل لحد ما نصلي*\n\nهيتفتح بعد 30 دقيقة إن شاء الله`
                            });

                            // فتح بعد 30 دقيقة
                            setTimeout(async () => {
                                try {
                                    await conn.groupSettingUpdate(chatId, 'not_announcement');
                                    await conn.sendMessage(chatId, {
                                        text: `🔓 *الجروب اتفتح بعد الصلاة*\n\nتقبل الله منا ومنكم 🤲`
                                    });
                                } catch {}
                            }, 30 * 60 * 1000);
                        } catch {}
                    }

                    // تنظيف lastNotified القديم
                    setTimeout(() => { delete lastNotified[notifyKey]; }, 120000);
                }
            } catch {}
        }
    }, 60_000);
}

export default async function before(m, { conn }) {
    // حفظ الـ conn في global عشان الـ interval يقدر يستخدمه
    if (!global._conn) global._conn = conn;
    return false;
}

