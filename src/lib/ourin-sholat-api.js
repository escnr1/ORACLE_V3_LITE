// ourin-sholat-api.js — Compatibility shim: مواقيت الصلاة (API عام مجاني: aladhan.com)
import axios from 'axios';

export async function searchKota(query) {
    // aladhan بيشتغل بإحداثيات/مدينة+دولة مباشرة، فبنرجع الاسم نفسه كنتيجة واحدة
    return [{ id: query, name: query }];
}

export async function getTodaySchedule(city, country = 'Egypt') {
    const res = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
        params: { city, country, method: 5 },
        timeout: 20000
    });
    return res.data?.data;
}

export function extractPrayerTimes(schedule) {
    const t = schedule?.timings || {};
    return {
        fajr: t.Fajr, dhuhr: t.Dhuhr, asr: t.Asr,
        maghrib: t.Maghrib, isha: t.Isha, sunrise: t.Sunrise
    };
}

export default { searchKota, getTodaySchedule, extractPrayerTimes };
