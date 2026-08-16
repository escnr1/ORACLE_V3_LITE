// ════════════════════════════════════════
//  قسم "أدوات التحميل" (downloader) - 10 أوامر
//  كلها حسابات محلية بدون أي طلب شبكة عشان محدش يوقع
//  ORACLE
// ════════════════════════════════════════

const FILE_TYPES = {
    mp3: '🎵 ملف صوتي', wav: '🎵 ملف صوتي', m4a: '🎵 ملف صوتي',
    mp4: '🎬 فيديو', mkv: '🎬 فيديو', avi: '🎬 فيديو', mov: '🎬 فيديو',
    jpg: '🖼️ صورة', jpeg: '🖼️ صورة', png: '🖼️ صورة', webp: '🖼️ صورة',
    pdf: '📄 ملف PDF', doc: '📄 مستند Word', docx: '📄 مستند Word',
    zip: '🗜️ ملف مضغوط', rar: '🗜️ ملف مضغوط', apk: '📱 تطبيق أندرويد',
    exe: '💻 برنامج ويندوز', gif: '🎞️ صورة متحركة'
};

const handler = async (m, { command, text, args }) => {
    const t = (text || '').trim();

    switch (command) {
        case 'نوع_الملف': {
            if (!t) return m.reply('*⚠️ اكتب اسم ملف أو امتداد*\n_مثال:_ `.نوع_الملف song.mp3`');
            const ext = t.split('.').pop().toLowerCase();
            const type = FILE_TYPES[ext] || '❓ نوع مش معروف عندي';
            return m.reply(`📁 *الملف:* ${t}\n📌 *النوع:* ${type}`);
        }

        case 'وقت_التحميل_التقريبي': {
            const size = parseFloat(args[0]);
            const speed = parseFloat(args[1]);
            if (!size || !speed) return m.reply('*⚠️ الاستخدام:*\n`.وقت_التحميل_التقريبي <حجم بالميجا> <سرعة بالميجا/ث>`\n_مثال:_ `.وقت_التحميل_التقريبي 100 5`');
            const seconds = size / speed;
            const min = Math.floor(seconds / 60);
            const sec = Math.round(seconds % 60);
            return m.reply(`⏱️ *الوقت التقريبي:* ${min} دقيقة و ${sec} ثانية\n_(بافتراض سرعة ثابتة يا صايع)_`);
        }

        case 'تحويل_حجم_ذكي': {
            const n = parseFloat(t);
            if (!Number.isFinite(n)) return m.reply('*⚠️ اكتب رقم بالكيلوبايت*\n_مثال:_ `.تحويل_حجم_ذكي 5000`');
            let val = n, unit = 'KB';
            if (val >= 1024 * 1024) { val /= 1024 * 1024; unit = 'GB'; }
            else if (val >= 1024) { val /= 1024; unit = 'MB'; }
            return m.reply(`💾 *${n} KB* = *${val.toFixed(2)} ${unit}*`);
        }

        case 'فحص_رابط': {
            if (!t) return m.reply('*⚠️ اكتب رابط عشان أفحصه*');
            const valid = /^https?:\/\/[^\s]+\.[^\s]{2,}/i.test(t);
            return m.reply(valid ? '✅ *شكل الرابط سليم يا فنان*' : '❌ *الرابط شكله مش مظبوط، تأكد منه*');
        }

        case 'استخراج_دومين': {
            if (!t) return m.reply('*⚠️ اكتب رابط*');
            try {
                const domain = new URL(t.startsWith('http') ? t : `https://${t}`).hostname;
                return m.reply(`🌐 *الدومين:* ${domain}`);
            } catch {
                return m.reply('*❌ إيرور! الرابط ده مش صحيح*');
            }
        }

        case 'نصايح_تحميل': {
            return m.reply(
                `📥 *نصايح تحميل من السيستم:*\n\n` +
                `1️⃣ تأكد من مساحة التخزين قبل التحميل\n` +
                `2️⃣ استخدم شبكة واي فاي للملفات الكبيرة\n` +
                `3️⃣ اعمل فحص فيروسات لأي ملف من مصدر غريب\n` +
                `4️⃣ خد باكاب دايمًا قبل ما تفتح ملفات مش موثوقة`
            );
        }

        case 'حساب_زمن_رفع': {
            const size = parseFloat(args[0]);
            const speed = parseFloat(args[1]);
            if (!size || !speed) return m.reply('*⚠️ الاستخدام:*\n`.حساب_زمن_رفع <حجم بالميجا> <سرعة رفع بالميجا/ث>`');
            const seconds = size / speed;
            return m.reply(`📤 *وقت الرفع التقريبي:* ${Math.round(seconds)} ثانية`);
        }

        case 'اختصارات_التحميل': {
            return m.reply(
                `⚡ *أوامر التحميل الحقيقية عندك:*\n\n` +
                `🎥 يوتيوب، تيك توك، فيسبوك، انستجرام\n` +
                `_شوف قسم "التحميل" في المنيو الرئيسي_`
            );
        }

        case 'حجم_تقريبي_فيديو': {
            const min = parseFloat(args[0]);
            const quality = (args[1] || '720').replace('p', '');
            if (!min) return m.reply('*⚠️ الاستخدام:*\n`.حجم_تقريبي_فيديو <دقايق> <جودة مثل 720>`');
            const bitrate = { '360': 0.5, '480': 1, '720': 2.5, '1080': 5 }[quality] || 2.5;
            const sizeMB = (bitrate * 60 * min) / 8;
            return m.reply(`🎬 *الحجم التقريبي:* ${sizeMB.toFixed(1)} ميجا\n_(بجودة ${quality}p تقريبًا)_`);
        }
    }
};

handler.usage = [
    'نوع_الملف <اسم الملف>','وقت_التحميل_التقريبي <حجم> <سرعة>','تحويل_حجم_ذكي <KB>',
    'فحص_رابط <رابط>','استخراج_دومين <رابط>','نصايح_تحميل','حساب_زمن_رفع <حجم> <سرعة>',
    'اختصارات_التحميل','حجم_تقريبي_فيديو <دقايق> <جودة>'
];
handler.category = 'downloader';
handler.command  = [
    'نوع_الملف','وقت_التحميل_التقريبي','تحويل_حجم_ذكي','فحص_رابط','استخراج_دومين',
    'نصايح_تحميل','حساب_زمن_رفع','اختصارات_التحميل','حجم_تقريبي_فيديو'
];

export default handler;
