const handler = async (m, { conn, args }) => {
const participants = await conn.groupMetadata(m.chat).then(metadata => metadata.participants);
const jids = participants.map(p => p.id);

if (jids.length < 2) {
    return conn.sendMessage(m.chat, { text: "الجروب صغير أوي كده" });
}

const shuffledJids = [...jids].sort(() => Math.random() - 0.5);
const topUsers = shuffledJids.slice(0, Math.min(10, jids.length));

const emojis = ["😂", "🤬", "🙂", "😎"];
let em = emojis[Math.floor(Math.random() * emojis.length)]
let messageText = `*${em} توب اكتر 10 > ${args.join(' ')} ${em}*\n\n`;

topUsers.forEach((user, index) => {
    let percentage;
    if (index === 0) {
        percentage = Math.floor(Math.random() * 15) + 90; // 90-105%
    } else if (index === 1) {
        percentage = Math.floor(Math.random() * 15) + 80; // 80-95%
    } else if (index === 2) {
        percentage = Math.floor(Math.random() * 15) + 70; // 70-85%
    } else if (index === 3) {
        percentage = Math.floor(Math.random() * 15) + 60; // 60-75%
    } else if (index === 4) {
        percentage = Math.floor(Math.random() * 15) + 50; // 50-65%
    } else {
        percentage = Math.floor(Math.random() * 40) + 30; // 30-70%
    }
    
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "👤";
    messageText += `${medal} *${index + 1}.* @${user.split('@')[0]} - بنسبة *${percentage}%*\n`;
});

return conn.sendMessage(m.chat, { 
    text: messageText, 
    mentions: topUsers 
});
};
handler.usage =  ["توب"];
handler.category = "group";
handler.command = ["توب"];

export default handler;