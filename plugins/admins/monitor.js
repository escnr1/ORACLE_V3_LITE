// مراقبه - تسجيل نشاط الجروب
const getLog = (chat) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chat]) global._gs[chat] = {};
    if (!global._gs[chat].log) global._gs[chat].log = [];
    return global._gs[chat].log;
};

const handler = async (m, { conn, command }) => {
    if (command === 'مراقبه') {
        const g = getG(m.chat);
        g.monitor = !g.monitor;
        return m.reply(g.monitor ? '*✅ المراقبة اتشغلت*' : '*✅ المراقبة اتقفلت*');
    }

    if (command === 'سجل') {
        const log = getLog(m.chat);
        if (!log.length) return m.reply('*📋 السجل فارغ*');
        const text = log.slice(0, 20).map((l, i) => `${i + 1}. ${l}`).join('\n');
        return conn.sendMessage(m.chat, {
            text: `📋 *سجل النشاط (آخر 20):*\n\n${text}`
        }, { quoted: m });
    }
};

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return false;
    const g = getG(m.chat);
    if (!g.monitor) return false;

    const log = getLog(m.chat);
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const name = m.pushName || m.sender.split('@')[0];
    const type = m.message?.imageMessage ? '🖼️صورة' :
                 m.message?.videoMessage ? '🎬فيديو' :
                 m.message?.audioMessage ? '🔉صوت' :
                 m.message?.stickerMessage ? '🎭ستيكر' :
                 m.text ? `💬"${m.text.slice(0, 20)}"` : '📎ملف';

    log.unshift(`[${time}] ${name}: ${type}`);
    if (log.length > 50) log.pop();
    return false;
};

handler.command  = ['مراقبه', 'سجل'];
handler.usage    = ['مراقبه'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
