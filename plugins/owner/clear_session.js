// ════════════════════════════════════════
//  .مسح_الجلسة - يمسح ملفات تسجيل الدخول (auth) عشان تعمل ربط جديد
//  للمطور فقط، ومحتاج تأكيد قبل ما يحذف أي حاجة
// ════════════════════════════════════════

import fs from 'fs';
import path from 'path';

// كل الأماكن المحتملة اللي ممكن الجلسة تتخزن فيها في المشروع ده
const SESSION_PATHS = ['./sessions', './auth_info', './session'];

const rmIfExists = (p) => {
    const full = path.resolve(process.cwd(), p);
    if (fs.existsSync(full)) {
        fs.rmSync(full, { recursive: true, force: true });
        return true;
    }
    return false;
};

const handler = async (m, { text, conn }) => {
    if (!m.isOwner) return m.reply('*❌ الأمر ده للمطور بس.*');

    const confirmed = (text || '').trim() === 'تأكيد';

    if (!confirmed) {
        return m.reply(
            `*⚠️ تحذير قبل ما تكمل!*\n\n` +
            `الأمر ده هيمسح ملفات تسجيل الدخول بتاعة البوت خالص،\n` +
            `والبوت هيقفل (offline) لحد ما تعمل ربط (pairing) جديد من الأول.\n\n` +
            `لو متأكد، ابعت:\n*.مسح_الجلسة تأكيد*`
        );
    }

    let deleted = [];
    for (const p of SESSION_PATHS) {
        try {
            if (rmIfExists(p)) deleted.push(p);
        } catch (e) {
            console.error(`[مسح_الجلسة] الحذف مضربش ${p}:`, e?.message);
        }
    }

    await m.reply(
        deleted.length
            ? `*✅ الجلسة اتمسحت (${deleted.join(', ')})*\n\n` +
              `البوت هيقفل دلوقتي، شغّله تاني (\`node index.js\`) وهيديك كود ربط جديد.`
            : `*ℹ️ مفيش ملفات جلسة موجودة أصلاً تتمسح.*`
    );

    if (deleted.length) {
        setTimeout(() => process.exit(0), 1500);
    }
};

handler.usage    = ['مسح_الجلسة تأكيد'];
handler.category = 'owner';
handler.command  = ['مسح_الجلسة', 'مسح_الجلسه', 'clear_session', 'logout'];
handler.owner    = true;

export default handler;
