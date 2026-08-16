// أوامر الأقسام بس - مش الكلام العادي
const SECTION_COMMANDS = [
    'يومي','اسبوعي','شهري','تسجيل','حذف_تسجيلي',
    'مسابقه','تفكيك','عين','اكس','xo',
    'يوتيوب','يوت_اغنيه','تيك','انستا','فيس','اغنيه','فيديو',
    'كشف_البوتات','طرد_البوتات','اوامر','تنصيب',
    'البوتات','تفعيل','الايرورات','حالة_المطور',
    'ضيف_ديف','اضافه_ديف','وضع_التحديث','ايقاف_التحديث',
    'فريق_الدعم','الدعم','support'
];

export default async function before(m, { conn }) {
    if (!m.text || m.prefix || m.fromMe) return false;
    if (!m.isGroup) return false;

    const word = (m.text || '').trim().split(' ')[0].toLowerCase();
    if (!SECTION_COMMANDS.includes(word)) return false;

    await conn.sendMessage(m.chat, {
        text: `حَـطً نٌقِطَـهَ قَبٌـلٕ اًلاَمٓـر 🫩🚫`
    }, { quoted: m });

    return true;
}
