const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده بيشتغل في الجروبات بس*');
    if (!m.isOwner && !m.isAdmin) return m.reply('*❌ الأمر ده للمشرفين بس*');
    if (!m.isBotAdmin) return m.reply('*❌ لازم البوت يكون ادمن*');

    const bots = global.detectedBots?.[m.chat];
    if (!bots?.length) return m.reply('*❌ مفيش بوتات متحفظة، اكتب .كشف_البوتات الأول*');

    await m.reply(`*⚡ استنى بس، بطرد ${bots.length} بوت...*`);

    let kicked = 0;
    for (const jid of bots) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
            kicked++;
            await new Promise(r => setTimeout(r, 600));
        } catch {}
    }

    delete global.detectedBots[m.chat];

    await conn.sendMessage(m.chat, {
        text: `*✅ اتطرد ${kicked} بوت من الجروب*\n\n> _الجروب نضيف دلوقتي 🧹_`
    });
};

handler.usage = ['طرد_البوتات'];
handler.category = 'owner';
handler.command = ['طرد_البوتات'];
handler.botAdmin = true;

export default handler;
