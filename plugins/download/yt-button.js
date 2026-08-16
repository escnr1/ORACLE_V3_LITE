const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('💙 ~ اكتب نص الفيديو او الاغنيه ~ ❤️');

    m.react('🔍');

    try {
        const res = await fetch(
            `https://emam-api.web.id/home/sections/Search/api/YouTube/search?q=${encodeURIComponent(text)}`,
            { signal: AbortSignal.timeout(15000) }
        );
        const json = await res.json();
        const data = json?.data;

        // Cannot read properties of undefined (reading '0') - data ممكن يكون undefined أو فاضي
        if (!Array.isArray(data) || !data.length) {
            m.react('❌');
            return m.reply('*❌ مش لاقي نتائج، جرب كلمة تانية*');
        }

        const { title, image, timestamp: time, url } = data[0];

        if (!url) {
            m.react('❌');
            return m.reply('*❌ مش لاقي الفيديو، جرب كلمة تانية*');
        }

        m.react('✅');

        await conn.sendButton(m.chat, {
            imageUrl: image || 'https://i.postimg.cc/XJX2cRJc/0af18dd2b2543651464204773234c433.jpg',
            bodyText: `${title || 'بدون عنوان'} ╎ ${time || ''}`,
            footerText: '🕸️ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 ~ 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 🕸️',
            buttons: [
                { name: 'quick_reply', params: { display_text: '🎼 ╎ تـحـمـيـل صـوت', id: `.يوت_اغنيه ${url}` } },
                { name: 'quick_reply', params: { display_text: '🎬 ╎ تـحـمـيـل فـيـديـو', id: `.يوتيوب ${url}` } }
            ],
            mentions: [m.sender],
            interactiveConfig: { buttons_limits: 10, list_title: '', button_title: '', canonical_url: url }
        }, m);

    } catch (e) {
        m.react('❌');
        m.reply(`*❌ البحث مضربش:* ${e.message?.slice(0, 80)}`);
    }
};

handler.usage = ['فيديو', 'اغنيه', 'شغل'];
handler.category = 'download';
handler.command = ['اغنيه', 'فيديو', 'اغنية', 'play', 'video'];
export default handler;
