const test = async (m, { conn, bot }) => {
  m.react("🟢")
  
  conn.msgUrl(m.chat, "♡゙ بيقفل البوت دلوقتي...", { 
    title: "ORACLE بوت واتساب من مكتبة ESCLINK",
    body: "البوت سهل التعديل خالص",
    img: "https://i.postimg.cc/XJX2cRJc/0af18dd2b2543651464204773234c433.jpg",
    big: false 
  });
  
  setTimeout(() => {
    bot.stop();
  }, 1000); 
};

test.category = "owner";
test.command = ["ايقاف", "stop"];
test.usage = ["ايقاف"];
test.owner = true;
export default test;
