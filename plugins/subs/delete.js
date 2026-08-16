const run = async (m, { args, conn, bot }) => {
  const sub = global.subBots;
  if (!sub) return m.reply("*⚠ نظام البوتات الفرعية مقفول دلوقتي يا معلم*");

  if (!args[0]) {
    return m.reply(`📝 حذف بوت\n\nمثال:\n${bot.config.prefix[0]}حذف_بوت 1\n${bot.config.prefix[0]}حذف_بوت 201234567890`);
  }

  const input = args[0];
  let deleted = false;

  if (/^\d+$/.test(input) && input.length <= 2) {
    const idx = parseInt(input) 
    try {
      await sub.removeByIndex(idx);
      deleted = true;
    } catch (e) {
      return m.reply(`⚠ فشل: ${e.message}`);
    }
  } 
  else if (/^\d+$/.test(input)) {
    deleted = await sub.removeByPhone(input);
    if (!deleted) return m.reply(`⚠ مفيش بوت بالرقم ${input}`);
  }

  if (deleted) {
    await m.reply(`✅ البوت اتمسح تمام`);
  }
};

run.command = ["حذف_بوت"];
run.usage =  ["حذف_بوت"];
run.category = "sub";
run.noSub = true;
export default run;