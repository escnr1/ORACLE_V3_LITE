const handler = async (m, { conn }) => {
  const req = await conn.groupRequestParticipantsList(m.chat);
  if (!req?.length) return m.reply("📭 مفيش ريكوستات");

  let text = req.map((r, i) =>
    `${i + 1}- @${r.phone_number.split("@")[0]}`
  ).join("\n");

  await conn.sendMessage(m.chat, {
    text: `📥 قائمة الريكوستات:\n\n${text}`,
    mentions: req.map(r => r.phone_number)
  }, { quoted: global.reply_status });
};

handler.command = ["الريكوستات", "الطلبات"];
handler.usage = ['الريكوستات'];
handler.category = "admins";
handler.admin = true;
handler.botAdmin = true

export default handler;