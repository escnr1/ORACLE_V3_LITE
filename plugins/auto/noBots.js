export default async function before(m, { conn, bot }) {
    // الجروبات المحمية - البوتات الفرعية مش تشتغل فيها
    const protectedGroups = [
        '120363353449975838@g.us',
        '120363418376913985@g.us'
    ];

    if (bot.isSubBot && protectedGroups.includes(m.chat)) {
        return true;
    }

    // السماح للبوتات الفرعية بكتابة الأوامر في بقية الجروبات
    return false;
}
