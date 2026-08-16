import { igdl } from 'btch-downloader';

// المكتبة بترجع array من عناصر ميديا (فيديو أو صور)، كل عنصر شكله
// بيختلف شوية حسب النسخة، فبنجرب أكتر من اسم حقل محتمل
function extractItems(data) {
    const d = data?.data || data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.url)) return d.url;
    return [];
}

const handler = async (m, { conn, text }) => {
    if (!text || !text.includes('instagram.com')) return m.reply('*❌ حط رابط إنستقرام صحيح جنب الأمر*');
    m.react('⏳');

    try {
        const result = await igdl(text.trim());
        console.log('[Instagram.js] رد المكتبة:', JSON.stringify(result).slice(0, 300));

        const items = extractItems(result);
        if (!items.length) throw new Error('مقدرتش أجيب أي ميديا من الرابط ده');

        for (const item of items.slice(0, 5)) {
            const url = item?.url || item?.download_url || item;
            if (!url || typeof url !== 'string') continue;

            const fileRes = await fetch(url, { signal: AbortSignal.timeout(60000) });
            if (!fileRes.ok) continue;
            const buffer = Buffer.from(await fileRes.arrayBuffer());
            const isVideo = /\.mp4(\?|$)/i.test(url) || item?.resolution;

            await conn.sendMessage(m.chat,
                isVideo
                    ? { video: buffer, caption: '📥 Instagram', mimetype: 'video/mp4' }
                    : { image: buffer, caption: '📷 Instagram' },
                { quoted: m }
            );
        }
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 150)}`);
    }
};

handler.usage = ['انستا'];
handler.category = 'download';
handler.command = ['انستا', 'instagram', 'ig'];
export default handler;
