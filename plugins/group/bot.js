let handler = async (m, { conn }) => {
    await conn.circular(m.chat, { vid: "https://files.catbox.moe/gvj78c.mp4", sec: 200 }, m);
}

handler.command = ["بوم"];
handler.usage     = ['بوم'];
handler.usePrefix = false;

export default handler;
