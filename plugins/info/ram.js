import os from 'os';

const handler = async (m, { conn }) => {
  const txt = `
  ⊱⋅ ────────────────── ⋅⊰
🪾╎ الـمسـتـخـدم: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB
🌳╎ الـمتـبــقـي: ${(os.freemem() / 1024 / 1024).toFixed(1)}MB
  ⊱⋅ ────────────────── ⋅⊰
`;

  await conn.msgUrl(m.chat, txt, {
    img: "ttps://i.postimg.cc/76bBMFhk/abaed7d219de0329c61e822329663c4f.jpg" ,
    caption: txt,
    title: "الرام",
    body: "بنشوف استهلاك الرام دلوقتي.. والباقي قد إيه",
    big: false,
    mentions: [m.sender]
  }, global.reply_status);
};

handler.command = ["الرام", "ram"];
handler.category = "info";
handler.usage = ["الرام", "ram"];
export default handler;