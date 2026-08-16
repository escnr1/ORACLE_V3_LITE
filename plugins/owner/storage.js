import { execSync } from "child_process";
import fs from "fs";

const handler = async (m, { conn, bot }) => {
  try {
    m.react("🔍");

    // فحص المساحة الحالية
    const diskBefore = execSync("df -h / | tail -1", { encoding: "utf-8" }).trim();
    const parts = diskBefore.split(/\s+/);
    const used = parts[2], avail = parts[3], percent = parts[4];

    // حساب حجم كل مجلد
    const getSize = (path) => {
      try {
        return execSync(`du -sh ${path} 2>/dev/null | cut -f1`, { encoding: "utf-8" }).trim();
      } catch { return "0"; }
    };

    const sessionSize = getSize("./session");
    const tmpSize = getSize("/tmp");
    const logsSize = getSize("./logs");
    const storeSize = getSize("./store");

    await conn.sendMessage(m.chat, {
      text: `*🗂️ تقرير المساحة*\n\n` +
        `📊 *المستخدم:* ${used}\n` +
        `✅ *الفاضي:* ${avail}\n` +
        `📈 *النسبة:* ${percent}\n\n` +
        `📁 *session:* ${sessionSize}\n` +
        `📁 *tmp:* ${tmpSize}\n` +
        `📁 *logs:* ${logsSize}\n` +
        `📁 *store:* ${storeSize}\n\n` +
        `> اكتب *.تنظيف شامل* عشان تنضف`
    }, { quoted: m });

  } catch (e) {
    await m.reply(`\`\`\`${e.message}\`\`\``);
  }
};

handler.command = ["مساحة"];
handler.usage = ["مساحة"];
handler.category = "owner";
handler.owner = true;
handler.disabled = false;

export default handler;