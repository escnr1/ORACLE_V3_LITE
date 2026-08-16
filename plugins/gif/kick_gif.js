import { gifToMp4, AnimeGif } from "../../system/utils.js";


let handler = async (m, { conn, command }) => {
    try {
        let target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply(`*~ 🦵 منشن شخص مثل .${command} @اسم ~*`);

        let group = await conn.groupMetadata(m.chat);
        if (!group.participants.find(p => p.id === target)) {
            return m.reply(`*🕸️ ~ مش لاقي العضو ده في الجروب*`);
        }

        const res = await AnimeGif("kick");
        const { url, anime_name } = res;
        const video = await gifToMp4(url);

        await conn.sendMessage(m.chat, {
            caption: `*_@${m.sender.split('@')[0]} ركل @${target.split('@')[0]}_*\n> *_الانمي: ${anime_name}_*`,
            video: video,
            gifPlayback: true,
            mentions: [target, m.sender]
        });

    } catch (e) {
        m.reply(`*❌ ${e.message}*`);
    }
};

handler.usage = ["ركل @منشن"];
handler.category = "gif";
handler.command = ["ركل", "kick_gif", "ضرب_رجل"];
export default handler;
