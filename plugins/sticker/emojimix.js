import fetch from 'node-fetch';
import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn, text }) => {
    if (!text || !text.includes('+')) {
        return m.reply('*❌ اكتب إيموجيين بينهم +*\n\nمثال: .مزج_إيموجي 😍+🔥');
    }

    const [emo1, emo2] = text.split('+').map(e => e.trim());
    if (!emo1 || !emo2) return m.reply('*❌ اكتب إيموجيين بينهم +*');

    m.react('⏳');
    try {
        const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${emo1}_${emo2}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results?.length) {
            return m.reply('*❌ مفيش مزج للإيموجيين دول*');
        }

        for (const x of data.results) {
            const ستيكر = await (new Sticker(x.url, {
                type: 'full',
                categories: x.tags || []
            })).toMessage();
            await conn.sendMessage(m.chat, ستيكر, { quoted: m });
        }
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ حصل خطأ يا معلم:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['مزج_إيموجي'];
handler.command = ['مزج_إيموجي', 'emojimix', 'مزج-إيموجي'];
handler.category = 'sticker';

export default handler;
