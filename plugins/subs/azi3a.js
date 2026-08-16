const run = async (m, { conn, bot }) => {
  const sub = global.subBots;
  if (!sub) return m.reply("*⚠ نظام البوتات الفرعية مقفول دلوقتي يا معلم*");
  
  if (!m.quoted) return m.reply("*📢رد علي الرساله الي عوز تعمل ليها اذاعه*");
  
  
  const bots = sub.list();
  const activeBots = bots.filter(b => b.connected && b.phone && b.id !== bot.id);
  
  if (activeBots.length === 0) return m.reply("*مـفـيـش بـوتـات فـࢪعـيـة عشان الإذاعـه⚠*");
  
  let success = 0;
  let fail = 0;
  let groupCount = 0;
  
  for (const b of activeBots) {
    try {
      const botConn = sub.get(b.id);
      const sock = botConn?.sock;
      if (!sock) continue;
      
      const groups = await sock.groupFetchAllParticipating();
      const groupList = Object.values(groups);
      groupCount += groupList.length;
      
      for (const group of groupList) {
        try {
          // جلب أعضاء الجروب
          const groupMetadata = await sock.groupMetadata(group.id);
          const participants = groupMetadata.participants.map(p => p.id);
          
          await sock.sendMessage(group.id, {
            forward: m.quoted.fakeObj(),
            mentions: participants
          }, { quoted: global.reply_status || m });
          success++;
          await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
          fail++;
        }
      }
    } catch (e) {
      fail++;
    }
  }
  
  await m.reply(`✅⤿ تـم الـإذاعـه 𑁍
⊱⋅ ──────────── ⋅⊰
✓✅ الـنـجـاح: ${success}
✓🚫 فـشـل: ${fail}
✓🤖 الـبـوتـات: ${activeBots.length}
✓👥 الـجـروبـات: ${groupCount}
⊱⋅ ──────────── ⋅⊰
> *_Oracle SubBot System_*`);
};

run.command = ["اذاعة_فرعي", "اذاعه_فرعي"];
run.usage =  ["اذاعة_فرعي"];
run.category = "sub";
run.noSub = true;
run.owner = true;
export default run;