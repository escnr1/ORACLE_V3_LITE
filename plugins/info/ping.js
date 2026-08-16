const handler = async (m, { conn }) => {
  const start = process.hrtime.bigint();
  await conn.sendMessage(m.chat, { text: "🏓 اختبار البينج" });
  const end = process.hrtime.bigint();
  const ping = Number(end - start) / 1e6;
  
  await conn.msgUrl(m.chat, `⚡ سرعة البوت: ${ping.toFixed(2)}ms`, {
    img: "https://i.postimg.cc/XJX2cRJc/0af18dd2b2543651464204773234c433.jpg",
    title: "سرعة البوت",
    body: "بنختبر سرعة البوت دلوقتي.. سريع ولا لأ؟",
    big: false
  }, global.reply_status);
};

handler.command = ["بنج", "ping"];
handler.category = "info";
handler.usage = ["بنج"];
export default handler;