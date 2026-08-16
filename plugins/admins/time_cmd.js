// وقت - الوقت الحالي
const handler = async (m, { conn }) => {
    const now = new Date();
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    await conn.sendMessage(m.chat, {
        text: `🕐 *الوقت والتاريخ*\n\n⏰ *الوقت:* ${time}\n📅 *التاريخ:* ${date}`
    }, { quoted: m });
};
handler.command  = ['وقت', 'التاريخ'];
handler.usage    = ['وقت'];
handler.category = 'admins';
export default handler;
