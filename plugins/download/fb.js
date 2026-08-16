import { fbdown } from 'btch-downloader';

// استخراج رابط الفيديو من أي شكل استجابة محتمل من المكتبة
// (النسخ المختلفة من المكتبة بترجع أسماء حقول شوية مختلفة)
function extractVideoUrl(data) {
    const d = data?.data || data;
    return d?.HD || d?.hd || d?.Normal_video || d?.sd || d?.SD
        || d?.url_1080p || d?.url_720p || d?.url || d?.video
        || (Array.isArray(d) ? d[0]?.url : null);
}

const handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply(`*❲ ❤️ ❳ ~ حط رابط الفيديو بعد الأمر*\nمثال: .${command} https://www.facebook.com/reel/xxx`);
    m.react('🌾');

    try {
        const result = await fbdown(text.trim());
        console.log('[fb.js] رد المكتبة:', JSON.stringify(result).slice(0, 300));

        const videoUrl = extractVideoUrl(result);
        if (!videoUrl) throw new Error('مقدرتش أجيب رابط الفيديو من الرد، جرب رابط تاني');

        const fileRes = await fetch(videoUrl, { signal: AbortSignal.timeout(60000) });
        if (!fileRes.ok) throw new Error(`السيرفر رد بخطأ ${fileRes.status}`);
        const buffer = Buffer.from(await fileRes.arrayBuffer());

        await conn.sendMessage(m.chat, {
            video: buffer, caption: `> *اتعمل بواسطة ~ ${m.pushName}*`, mimetype: 'video/mp4'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 150)}`);
    }
};

handler.usage = ['فيس'];
handler.category = 'download';
handler.command = /^(فيس|فيسبوك|fb|fbdl|facebook)$/i;
export default handler;
