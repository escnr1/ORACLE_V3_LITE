// ════════════════════════════════════════
//  plugins/owner/rate.js
//  أمر تقييم البوت (.تقيم) — كان زرار "تقيم" في menu_builder.js
//  بيشاور عليه من غير ما يكون له كود فعلي، فده الأمر الناقص.
// ════════════════════════════════════════
import fs from 'fs';
import path from 'path';

const RATINGS_FILE = path.join(process.cwd(), 'system', 'ratings.json');

function loadRatings() {
    try { return JSON.parse(fs.readFileSync(RATINGS_FILE, 'utf8')); }
    catch { return {}; }
}

function saveRatings(data) {
    fs.mkdirSync(path.dirname(RATINGS_FILE), { recursive: true });
    fs.writeFileSync(RATINGS_FILE, JSON.stringify(data, null, 2));
}

const handler = async (m, { conn, text }) => {
    const ratings = loadRatings();
    const stars = parseInt((text || '').trim());

    // .تقيم من غير رقم -> يعرض متوسط التقييم الحالي
    if (!text || isNaN(stars)) {
        const values = Object.values(ratings);
        if (!values.length) {
            return m.reply(
                `⭐ *مفيش تقييمات لسه*\n\n` +
                `قيّم البوت من 1 لـ 5 نجوم:\n*.تقيم <رقم من 1 لـ 5>*\n` +
                `مثال: *.تقيم 5*`
            );
        }
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
        const stars5 = '⭐'.repeat(Math.round(avg));
        return m.reply(
            `📊 *تقييم ${'𝐎𝐑𝐀𝐂𝐋𝐄 𝐕𝟑'}*\n\n` +
            `${stars5}\n` +
            `المتوسط: *${avg}/5* من *${values.length}* تقييم\n\n` +
            `قيّم البوت: *.تقيم <رقم من 1 لـ 5>*`
        );
    }

    if (stars < 1 || stars > 5) {
        return m.reply('❌ التقييم لازم يكون رقم من 1 لـ 5');
    }

    ratings[m.sender] = stars;
    saveRatings(ratings);

    return m.reply(`✅ تسلم على تقييمك! إنت قيّمت البوت بـ ${'⭐'.repeat(stars)} (${stars}/5)`);
};

handler.command = ['تقيم', 'تقييم', 'rate'];
handler.category = 'owner';
handler.usage = ['.تقيم <1-5>'];
handler.description = 'تقييم البوت من 1 إلى 5 نجوم';

export default handler;
