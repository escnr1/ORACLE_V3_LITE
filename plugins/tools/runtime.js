/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

function وقت_التشغيل(ms) {
    const ثانية = 1000;
    const دقيقة = 60 * ثانية;
    const ساعة = 60 * دقيقة;
    const يوم = 24 * ساعة;

    const أيام = Math.floor(ms / يوم);
    const ساعات = Math.floor((ms % يوم) / ساعة);
    const الدقائق = Math.floor((ms % ساعة) / دقيقة);
    const الثواني = Math.floor((ms % دقيقة) / ثانية);

    let ناتج = '';
    if (أيام) ناتج += `${أيام} يوم `;
    if (ساعات) ناتج += `${ساعات} ساعة `;
    if (الدقائق) ناتج += `${الدقائق} دقيقة `;
    if (الثواني) ناتج += `${الثواني} ثانية`;
    return ناتج.trim() || '0 ثانية';
}

const handler = async (m, { conn }) => {
    const وقت = process.uptime() * 1000;
    const ذاكرة = process.memoryUsage();
    const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);

    const رد =
        `*⏱️ وقت تشغيل البوت*\n` +
        `${'━'.repeat(30)}\n\n` +
        `🕐 *مدة التشغيل:* ${وقت_التشغيل(وقت)}\n` +
        `🧠 *الذاكرة المستخدمة:* ${mb(ذاكرة.heapUsed)} MB\n` +
        `💾 *إجمالي الذاكرة:* ${mb(ذاكرة.heapTotal)} MB\n` +
        `📦 *RSS:* ${mb(ذاكرة.rss)} MB\n\n` +
        `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`;

    m.reply(رد);
};

handler.usage = ['وقت_تشغيل'];
handler.command = ['وقت_تشغيل', 'runtime', 'uptime'];
handler.category = 'tools';

export default handler;
