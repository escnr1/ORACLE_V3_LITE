import { createSticker } from "../../system/utils.js";

const test = async (m, { conn, bot }) => {
  if (!m.quoted) return m.reply("❤️ ~ رد على صورة أو فيديو عشان أحوله ملصق ~ 💙");

  const { pack, author } = bot.config.info.copyright;
  const q = await m.quoted;

  if (!q || !q.mimetype) return m.reply("❌ مقدرتش أقرا الميديا، اتأكد إنك رديت على صورة أو فيديو صح.");

  const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

  await conn.sendMessage(
    m.chat,
    { sticker: buffer },
    { quoted: global.reply_status || m }
  );
};

test.usage = ["ملصق"];
test.command = ["ملصق", "s"];
test.category = "sticker";
export default test;
