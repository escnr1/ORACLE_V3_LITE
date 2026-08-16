// أمر عرض حالة السيرفر - حالة_السيرفر / serverstatus
const handler = async (m, { conn, bot }) => {
    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');

    const mem = process.memoryUsage();
    const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
    const rssMB  = Math.round(mem.rss / 1024 / 1024);
    const uptimeSec = Math.round(process.uptime());
    const h = Math.floor(uptimeSec / 3600);
    const min = Math.floor((uptimeSec % 3600) / 60);
    const sec = uptimeSec % 60;

    const isConnected = conn?.user ? '🟢 متصل' : '🔴 مش متصل';
    const lastPing = global._lastPing || 'لسه معملش';

    return m.reply(
        `🛡️ *حالة السيرفر*\n\n` +
        `📡 *الاتصال:* ${isConnected}\n` +
        `⏱️ *مدة التشغيل:* ${h}س ${min}د ${sec}ث\n` +
        `🧠 *Heap:* ${heapMB} MB\n` +
        `💾 *RSS:* ${rssMB} MB\n` +
        `🏓 *آخر نبضة داخلية:* ${lastPing}\n\n` +
        `✅ نظام منع النوم/التعليق شغال`
    );
};

handler.command  = ['حالة_السيرفر', 'serverstatus'];
handler.usage    = ['حالة_السيرفر'];
handler.category = 'owner';
handler.owner    = true;

export default handler;
