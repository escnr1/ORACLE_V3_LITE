const run = async (m, { conn, bot }) => {
  const sub = global.subBots;
  if (!sub) return m.reply("*⚠ نظام البوتات الفرعية مقفول دلوقتي يا معلم*");

  const stats = sub.stats();
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  const text = `📊⤿ احـصـائـيـات الـبـوتـات الـفـرعـيـه 𑁍
⊱⋅ ──────────── ⋅⊰
📈 — المجموع: ${stats.total}
🟢 — متصل: ${stats.connected}
🔴 — غير متصل: ${stats.disconnected}
💬 — الرسائل: ${stats.totalMessages}
⊱⋅ ──────────── ⋅⊰
⏱️ — مدة التشغيل: ${days} يوم ${hours} ساعة ${minutes} دقيقة
⊱⋅ ──────────── ⋅⊰
🆔 — البوت الرئيسي: ${bot.sock.user.id.split('@')[0]}
⊱⋅ ──────────── ⋅⊰
> *_Oracle SubBot System_*`;

  await m.reply(text);
};

run.command = ["احصائيات_البوتات"];
run.noSub = true;
run.usage =  ["احصائيات_البوتات"];
run.category = "sub";
export default run;