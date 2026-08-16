// أمر قفل وفتح الجروب + قفل/تجديد الرابط (موحّد - بديل lock_controls.js)
import { adminGuard, checkCommandCooldown, notAdminMsg, notAuthMsg } from '../../system/bot_protection.js';

const handler = async (m, { conn, command, bot }) => {
  if (!m.isGroup) return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');

  // Live check: تحديث الـ isBotAdmin من جديد
  await adminGuard(m, { conn, bot });

  // فحص cooldown
  const cooldown = checkCommandCooldown(command, m.sender, m.chat);
  if (!cooldown.allowed) {
    return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
  }

  if (!m.isAdmin) return m.reply(notAuthMsg());
  if (!m.isBotAdmin) return m.reply(notAdminMsg());

  try {
    if (command === "قفل" || command === "lock" || command === "قفل_الجروب") {
      await conn.groupSettingUpdate(m.chat, 'announcement');
      return m.reply('🔒 *الشات اتقفل* 🔒\nالادمنية بس اللي يقدروا يبعتوا');
    }

    if (command === "فتح" || command === "unlock" || command === "فتح_الجروب") {
      await conn.groupSettingUpdate(m.chat, 'not_announcement');
      return m.reply('🔓 *الشات اتفتح* 🔓\nالكل يقدر يبعت دلوقتي');
    }

    if (command === "lock-link" || command === "قفل_الرابط") {
      await conn.groupSettingUpdate(m.chat, 'locked');
      return m.reply('🔒 *رابط الجروب اتقفل*\nالادمنية بس اللي يقدروا يعدّلوا الإعدادات');
    }

    if (command === "reset-link" || command === "تجديد_الرابط") {
      await conn.groupRevokeInvite(m.chat);
      const code = await conn.groupInviteCode(m.chat);
      return conn.sendMessage(m.chat, {
        text: `🔄 *رابط الجروب اتجدد*\n\nhttps://chat.whatsapp.com/${code}`
      }, { quoted: m });
    }
  } catch (e) {
    return m.reply(`*❌ خطأ: ${e.message || 'الأمر ماتنفذش - اتأكد إن البوت ادمن'}*`);
  }
};

handler.usage    = ["قفل", "فتح", "lock-link", "reset-link"];
handler.category = "protection";
handler.command  = ["قفل", "فتح", "lock", "unlock", "lock-link", "reset-link", "قفل_الجروب", "فتح_الجروب", "قفل_الرابط", "تجديد_الرابط"];
handler.admin    = true;
handler.botAdmin = true;

export default handler;