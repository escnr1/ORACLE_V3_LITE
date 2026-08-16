const toGif = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply("~ رد على فيديو");
    }

    const buffer = await m.quoted.download();
    
    await conn.sendMessage(m.chat, { 
      video: buffer, 
      gifPlayback: true 
    });
  } catch (e) {
    await conn.sendMessage(m.chat, { text: e.message });
  }
};

toGif.usage = ["لجيف"];
toGif.category = "tools";
toGif.command = ["لجيف", "togif", "لچيف"];
export default toGif;