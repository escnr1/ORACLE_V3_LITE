const handler = async (m, { conn, text, bot }) => {
  if (!m.isOwner) {
    const ownerJid = bot?.config?.owners[0]?.jid;
    m.reply("` • طلبك اتبعت للمطور • `");
    await conn.sendMessage(ownerJid, { 
      text: `🔔 *طلب دخول جروب*\nمن: @${m.sender.split("@")[0]}\nالرابط: ${text || "معتش بعت رابط"}`, 
      mentions: [m.sender] 
    });
    return m.reply("✅ طلبك وصل للمطور");
  }

  if (!text) return m.reply("❌ ابعت رابط جروب واتساب");
  if (!text.includes("https://chat.whatsapp.com/")) return m.reply("❌ رابط واتساب بس");

  m.react("📂");

  try {
    // استخراج الكود من الرابط
    const code = text.split("https://chat.whatsapp.com/")[1]?.trim();
    if (!code) return m.reply("❌ الرابط غلط");

    await conn.groupAcceptInvite(code);
    m.reply("✅ دخلنا الجروب");
  } catch (e) {
    m.react("❌");
    m.reply(`❌ الدخول مضربش: ${e.message}`);
  }
};

handler.usage = ["انضم"];
handler.category = "group";
handler.command = ["انضم", "ادخل"];

export default handler;
