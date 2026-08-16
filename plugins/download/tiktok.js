const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ حط رابط تيك توك جنب الأمر*');
    m.react('⏳');

    try {
        const params = new URLSearchParams({ url: text, hd: '1' });
        const res = await fetch('https://tikwm.com/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Cookie: 'current_language=en',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Mobile Safari/537.36'
            },
            body: params
        });
        const data = await res.json();
        const d = data?.data;
        if (!d?.play) throw new Error('مقدرتش أجيب الفيديو');

        const fileRes = await fetch(d.play, { signal: AbortSignal.timeout(60000) });
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        await conn.sendMessage(m.chat, {
            video: buffer, caption: `🎬 ${d.title || 'TikTok'}`, mimetype: 'video/mp4'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تيك'];
handler.category = 'download';
handler.command = ['تيك', 'tiktok', 'tt'];
export default handler;
