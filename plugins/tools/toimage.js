const toimg = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply("~ رد على صوره");
    }

    const buffer = await m.quoted.download();
    
    await conn.sendMessage(m.chat, { 
      image: buffer
    });
  } catch (e) {
    await conn.sendMessage(m.chat, { text: e.message });
  }
};

toimg.usage = ["لصوره"];
toimg.category = "tools";
toimg.command = ["لصوره", "toimage", "toimg"];
export default toimg;