import { gifToMp4, AnimeGif } from "../../system/utils.js";


let handler = async (m, { conn, command }) => {
    try {
        let target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply(`*~ 💙 منشن شخص مثل /${command} @${m.sender.split('@')[0]} ❤️ ~*`);

        let group = await conn.groupMetadata(m.chat);
        if (!group.participants.find(p => p.id === target)) {
            return m.reply(`*🕸️ ~ مش لاقي العضو ده في الجروب*`);
        }

        const res = await AnimeGif("dance");
        const { url, anime_name } = res;
        const video = await gifToMp4(url);
        
        await conn.sendMessage(m.chat, {
            caption: `*_@${m.sender.split('@')[0]} بيخليك ترقص/ي @${target.split('@')[0]}_*\n> *_الانمي: ${anime_name}_*`,
            video: video,
            gifPlayback: true,
            mentions: [target, m.sender]
        });

    } catch (e) {
        m.reply(e.message);
    }
}
handler.usage = ["ارقص @منشن"];
handler.category = "gif";
handler.command = ["ارقص"];

export default handler;