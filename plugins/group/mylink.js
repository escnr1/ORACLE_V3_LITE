let handler = async (m, { conn }) => {
m.reply(`wa.me/${m.sender.split("@")[0]}`)
}
handler.usage = ["رابطي"];
handler.category = "group";
handler.command = ["رابطي"];

export default handler;