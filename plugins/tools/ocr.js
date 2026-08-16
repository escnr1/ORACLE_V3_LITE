import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) return m.reply("*ابعت الصوره الي و رد عليها الي عاوز انسخ منها الكلام (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)*");
    
    const buffer = await m.quoted.download();
    const form = new FormData();
    form.append('image', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

    const res = await axios.post('https://emam-api.web.id/home/sections/Tools/api/ocr-image', form, {
      headers: form.getHeaders()
    });

    await conn.sendMessage(m.chat, { text: res.data.result }, { quoted: m });
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `Err: ${error.message}` }, { quoted: m });
  }
};

handler.usage = ["نسخ"];
handler.command = ["نسخ", "ocr"];
handler.category = "tools";

export default handler;