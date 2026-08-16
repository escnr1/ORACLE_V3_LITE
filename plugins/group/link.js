let handler = async (m, {
    conn
}) => {
    try {
        m.reply(`❀° ┄──────────╮
🌷┊ *رابـــط الـــمـــجـــمـــوعـــة:* ${(await conn.groupMetadata(m.chat)).subject}
🌷┊
🌷┊ https://chat.whatsapp.com/` + await conn.groupInviteCode(m.chat) + `
🌷┊
🌷┊ ${conn.user.name || "Bot WhatsApp"}
╰──────────┄ °❀`)
    } catch {
        const mentionedUser = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        conn.sendMessage(m.chat, { 
            text: `❀° ┄──────────╮
🌷┊ لازم تحط @${mentionedUser.split('@')[0]} أدمن عشان تقدر تستخدم الأمر ده!
╰──────────┄ °❀`, 
            mentions: [mentionedUser]
        })
    }
}
handler.usage = ["لينك"];
handler.category = "group";
handler.command = ["لينك", "link"];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;