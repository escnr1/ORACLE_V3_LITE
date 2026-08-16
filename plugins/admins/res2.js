const handler = async (m, { conn }) => {
  const req = await conn.groupRequestParticipantsList(m.chat);
  if (!req?.length) return m.reply("📭 مفيش ريكوستات");

  const arg = parseInt(m.text.split(" ")[1]);
  const limit = Number.isFinite(arg) && arg > 0 ? arg : req.length;

  const list = req.slice(0, limit);

  for (let r of list) {
    await conn.groupRequestParticipantsUpdate(
      m.chat,
      [r.phone_number],
      "approve"
    );
  }

  m.reply(`✅ اتقبل ${list.length} ريكوست`);
};

handler.command = ["اقبل_ريكوستات"];
handler.usage = ['اقبل_ريكوستات', 'اقبل_الطلبات'];
handler.category = "admins";
handler.admin = true;
handler.botAdmin = true

export default handler;