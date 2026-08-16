import { execSync } from "child_process";

const handler = async (m, { conn, bot }) => {
    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner) return m.reply("*❌ الأمر ده للمطورين بس يا صاحبي*");
  try {
    m.react("🧹");
    await m.reply("*🧹 استنى بس، بنضف كل حاجة...*");

    let report = [];
    let totalCleaned = 0;

    const clean = (cmd, label) => {
      try {
        const count = execSync(
          `files=$(find ${cmd} 2>/dev/null | wc -l); rm -rf ${cmd} 2>/dev/null; echo $files`,
          { encoding: "utf-8" }
        ).trim();
        const n = parseInt(count) || 0;
        totalCleaned += n;
        if (n > 0) report.push(`🗑️ ${label}: *${n} ملف*`);
      } catch {}
    };

    // session keys
    clean("session/pre-key-*", "Session Keys");
    clean("session/device-list-*", "Device List");
    clean("session/sender-key-*", "Sender Keys");
    clean("session/app-state-*", "App State");

    // tmp & logs
    clean("/tmp/*", "Temp Files");
    clean("logs/*", "Logs");
    clean("store/*", "Store Cache");

    // npm cache
    try {
      execSync("npm cache clean --force 2>/dev/null", { encoding: "utf-8" });
      report.push("✅ NPM Cache: *اتنضف*");
    } catch {}

    const diskAfter = execSync("df -h / | tail -1", { encoding: "utf-8" }).trim();
    const avail = diskAfter.split(/\s+/)[3];

    m.react("🟢");
    await conn.sendMessage(m.chat, {
      text: `*✅ التنظيف الشامل خلص*\n\n` +
        `${report.length ? report.join("\n") : "مفيش ملفات تتمسح"}\n\n` +
        `📦 *المحذوف كله:* ${totalCleaned} ملف\n` +
        `💾 *المساحة الفاضية دلوقتي:* ${avail}`
    }, { quoted: m });

  } catch (e) {
    await m.reply(`\`\`\`${e.message}\`\`\``);
  }
};

handler.command = ["تنظيف_شامل"];
handler.usage = ["تنظيف_شامل"];
handler.category = "owner";
handler.owner = false;
handler.disabled = false;

export default handler;