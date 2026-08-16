const run = async (m, { conn, bot }) => {
    if (!m.isOwner) return m.reply('*🤔 الأمر ده للمطورين بس يدمج*');

    const sub = global.subBots;
    if (!sub) return m.reply("*⚠ نظام البوتات الفرعية مقفول دلوقتي يا معلم*");

    const bots = sub.list ? sub.list() : [];
    if (!bots.length) return m.reply("مفيش بوتات فرعية متثبتة📌");

    // عرض قائمة البوتات الفرعية بس - بدون طرد تلقائي
    let text = `🤖⤿ الـبـوتـات الـفـرعـيـه\n*╮┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ـ*\n`;
    const mentions = [];

    bots.forEach((b, i) => {
        const jid = b.phone ? `${b.phone}@s.whatsapp.net` : null;
        if (jid) mentions.push(jid);

        text += `⚜️ *#${i + 1}*\n`;
        text += `📱 — الرقم: ${jid ? `@${b.phone}` : b.phone || 'مش معروف'}\n`;
        text += `📍 — الحالة: ${b.connected ? '🟢 متصل' : '🔴 غير متصل'}\n`;
        text += `📨 — الرسائل: ${b.messages || 0}\n`;
        text += `🆔 — الايدي: ${b.id}\n`;
        text += `╯┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ـ\n`;
    });

    text += `\n> *_✓ الـمـجـمـوع: ${bots.length}_*`;

    const { images } = bot.config.info;
    const img = images?.[Math.floor(Math.random() * images.length)] ||
        'https://i.postimg.cc/JntTcfnP/782d05642e3887d29ed37900aa767c6a.jpg';

    await conn.sendMessage(m.chat, {
        text,
        mentions,
        contextInfo: {
            externalAdReply: {
                title: '𝑶𝑹𝑨𝑪𝑳𝑬 𝑩𝑶𝑻👨🏻‍💻🔥 | SubBots',
                body: '𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢',
                thumbnailUrl: img,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

run.command = ['البوتات', 'bots'];
run.noSub = true;
run.usage = ['البوتات'];
run.category = 'sub';
export default run;
