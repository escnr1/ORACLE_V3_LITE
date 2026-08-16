let handler = async (m, {
    conn,
    bot
}) => {
const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363422581600030@newsletter',
        newsletterName: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑶𝑹𝑨𝑪𝑳𝑬 𝑩𝑶𝑻👨🏻‍💻🔥 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐄𝐒/𝐄𝐒𝐂 𝐟𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
        body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
const { images } = bot.config.info;
const img = images.random()
await conn.sendMessage(m.chat, { 
  text: `
GitHub: _*https://github.com/moreand458-eng/Oracle-bot/tree/main*_

Video: _*https://youtube.com/@oracle_soft-1?si=NQXfvUay8ZvzBBzB*_

> *متنساش تحط نجمة للريبو 🌟*
`,
  contextInfo: context(m.sender, img)
}, { quoted: global.reply_status || m });
}
handler.usage = ["سكريبت"];
handler.category = "group";
handler.command = ["سكريبت", "سورس", "sc"];

export default handler;