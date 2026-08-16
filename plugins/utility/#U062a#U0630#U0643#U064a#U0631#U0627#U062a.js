const handler = async (m, { conn, command, text }) => {
    const minutes = parseInt(text, 10);
    const label = command === 'تذكير_الأكل' ? '🍽️ وقت الأكل!' : '😴 وقت النوم!';
    let delay = Number.isFinite(minutes) && minutes > 0 ? minutes : 60;
    delay = Math.min(delay, 7 * 24 * 60); // حد أقصى أسبوع

    m.reply(`*✅ هفكرك بعد ${delay} دقيقة*`);

    setTimeout(() => {
        conn.sendMessage(m.chat, {
            text: `${label}\n@${m.sender.split('@')[0]} فاكر الميعاد بتاعك؟ 😊`,
            mentions: [m.sender]
        }).catch(() => {});
    }, delay * 60 * 1000);
};

handler.usage    = ['تذكير_الأكل', 'تذكير_النوم'];
handler.category = 'utility';
handler.command  = ['تذكير_الأكل', 'تذكير_النوم'];
handler.cooldown = 3000;

export default handler;
