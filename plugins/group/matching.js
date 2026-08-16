const handler = async (m, { conn }) => {
    try {
        const { Scrapy } = await import('drakon');
        const res = await Scrapy.Matching();
        const { data } = JSON.parse(res);

        await conn.sendMessage(m.chat, {
            image: { url: data.boy },
            caption: `# Boy 🚹`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: global.reply_status || m });

        await conn.sendMessage(m.chat, {
            image: { url: data.girl },
            caption: `# girl 🚺`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: global.reply_status || m });

    } catch {
        await m.reply('*❌ حصل خطأ، حاول تاني*');
    }
};

handler.usage    = ['تطقيم'];
handler.category = 'group';
handler.command  = ['ماتشينج', 'تطقيم'];
export default handler;
