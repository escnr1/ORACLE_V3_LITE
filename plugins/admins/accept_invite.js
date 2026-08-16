// قبول / دعوه / تجديد
const handler = async (m, { conn, command, text }) => {
    if (command === 'قبول') {
        // قبول طلبات الانضمام
        try {
            await conn.groupRequestParticipantsList(m.chat).then(async (reqs) => {
                if (!reqs?.length) return m.reply('*مفيش طلبات انضمام*');
                for (const r of reqs) {
                    try { await conn.groupRequestParticipantsUpdate(m.chat, [r.jid], 'approve'); } catch {}
                }
                return m.reply(`*✅ ${reqs.length} طلب انضمام اتقبلوا*`);
            });
        } catch {
            m.reply('*❌ مفيش طلبات انضمام*');
        }
        return;
    }

    if (command === 'دعوه') {
        // إرسال دعوة لشخص
        const target = m.mentionedJid?.[0] || (text ? text.trim() + '@s.whatsapp.net' : null);
        if (!target) return m.reply('*مثال:* .دعوه @شخص');
        try {
            const code = await conn.groupInviteCode(m.chat);
            const link = `https://chat.whatsapp.com/${code}`;
            await conn.sendMessage(target, {
                text: `📨 *دعوة للانضمام*\n\n${link}`
            });
            return m.reply(`*✅ الدعوة اتبعتت*`);
        } catch { m.reply('*❌ مقدرتش أبعت*'); }
        return;
    }

    if (command === 'تجديد') {
        // تجديد رابط الجروب
        try {
            await conn.groupRevokeInvite(m.chat);
            const newCode = await conn.groupInviteCode(m.chat);
            return conn.sendMessage(m.chat, {
                text: `🔄 *رابط الجروب اتجدد*\n\nhttps://chat.whatsapp.com/${newCode}`
            }, { quoted: m });
        } catch { m.reply('*❌ مقدرتش أجدد الرابط*'); }
    }
};
handler.command  = ['قبول', 'دعوه', 'تجديد'];
handler.usage    = ['قبول', 'دعوه', 'تجديد'];
handler.admin    = true;
handler.botAdmin = true;
handler.category = 'admins';
export default handler;
