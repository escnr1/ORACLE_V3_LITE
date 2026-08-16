import { capcut } from 'btch-downloader';

function extractVideoUrl(data) {
    const d = data?.data || data;
    return d?.video_url || d?.video || d?.url || d?.download_url || d?.play;
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('*❌ حط رابط كاب كت بعد الأمر*\n\nمثال: .كاب_كت https://www.capcut.com/...');
    }
    if (!text.includes('capcut.com') && !text.includes('capcut.link')) {
        return m.reply('*❌ الرابط مش من كاب كت*');
    }

    m.react('⏳');
    try {
        const result = await capcut(text.trim());
        console.log('[capcut.js] رد المكتبة:', JSON.stringify(result).slice(0, 300));

        const videoUrl = extractVideoUrl(result);
        if (!videoUrl) throw new Error('مقدرتش أجيب رابط الفيديو من الرد');

        const fileRes = await fetch(videoUrl, { signal: AbortSignal.timeout(60000) });
        if (!fileRes.ok) throw new Error(`السيرفر رد بخطأ ${fileRes.status}`);
        const buffer = Buffer.from(await fileRes.arrayBuffer());

        const d = result?.data || result;
        await conn.sendMessage(m.chat, {
            video: buffer,
            caption: `🎬 *${d?.title || 'CapCut Video'}*\n\n> اتحمل من كاب كت`,
            mimetype: 'video/mp4'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 150)}`);
    }
};

handler.usage = ['كاب_كت'];
handler.command = ['كاب_كت', 'capcut', 'كابكت'];
handler.category = 'download';

export default handler;
