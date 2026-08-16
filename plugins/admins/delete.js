const PROTECTED_NUMBER = '201092178171';

const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply(" 🌹 - رد علي الرساله يا ذكي ")

  const senderNum = m.quoted.sender?.split('@')[0]?.split(':')[0];
  if (senderNum === PROTECTED_NUMBER) {
    return m.reply(" ❌ - مش ممكن تحذف رسايل الرقم ده ");
  }

  m.quoted.delete()
 // m.delete()
};

handler.command = ["حذف"];
handler.usage = ['حذف'];
handler.category = "admins";
handler.admin = true;

export default handler;