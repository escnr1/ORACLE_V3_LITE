// منشن الأعضاء - مع rate limit لتجنب spam
const cooldown = new Map();
const COOLDOWN_MS = 60 * 1000; // مرة كل دقيقة بس

const handler = async (m, { conn }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده في الجروبات بس*');

    // rate limit
    const now = Date.now();
    const last = cooldown.get(m.chat) || 0;
    if (now - last < COOLDOWN_MS) {
        const rem = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
        return m.reply(`*⏳ استنى ${rem} ثانية قبل ما تمنشن تاني*`);
    }
    cooldown.set(m.chat, now);

    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    const admins  = participants.filter(p => p.admin).map(p => p.id);
    const members = participants.filter(p => !p.admin).map(p => p.id);

    let text = '';
    text += `🗃️│ الاسم: ${metadata.subject}\n`;
    text += `📯│ التاريخ: ${new Date().toLocaleDateString('ar-EG')}\n\n`;
    text += `👑 *المشرفين (${admins.length})*\n`;
    admins.forEach((id, i) => { text += `🔰│ ${i+1}. @${id.split('@')[0]}\n`; });
    text += `\n👥 *الأعضاء (${members.length})*\n`;
    members.forEach((id, i) => { text += `│ ${i+1}. @${id.split('@')[0]}\n`; });
    text += `\n> *العدد كله: ${participants.length}*`;

    return conn.sendMessage(m.chat, {
        text,
        mentions: participants.map(p => p.id)
    }, { quoted: m });
};

handler.usage    = ['منشن'];
handler.category = 'admins';
handler.command  = ['منشن', 'منشنز', 'mention'];
handler.admin    = true;
export default handler;
