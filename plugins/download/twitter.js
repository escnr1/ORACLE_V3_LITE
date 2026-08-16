import axios from 'axios';

async function تحميل_تويتر(رابط) {
    // API مجاني لتحميل تويتر
    const res = await axios.get('https://twitsave.com/info', {
        params: { url: رابط },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
            'Referer': 'https://twitsave.com/'
        },
        timeout: 30000
    });

    const html = res.data;
    
    // استخراج الروابط من HTML
    const روابط = [];
    const regex_mp4 = /https:\/\/video\.twimg\.com[^"' ]+\.mp4[^"' ]*/g;
    let match;
    while ((match = regex_mp4.exec(html)) !== null) {
        if (!روابط.includes(match[0])) روابط.push(match[0]);
    }

    if (!روابط.length) throw new Error('مقدرتش أجيب الفيديو من الرابط ده');
    
    // أفضل جودة (أطول رابط عادةً)
    return روابط.sort((a, b) => b.length - a.length)[0];
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('*❌ حط رابط تويتر/X بعد الأمر*\n\nمثال: .تويتر https://x.com/...');
    }

    if (!text.includes('twitter.com') && !text.includes('x.com') && !text.includes('t.co')) {
        return m.reply('*❌ الرابط مش صح، حط رابط من تويتر أو X*');
    }

    m.react('⏳');
    try {
        const video_url = await تحميل_تويتر(text.trim());
        
        const res = await axios.get(video_url, {
            responseType: 'arraybuffer',
            timeout: 120000,
            signal: AbortSignal.timeout(120000)
        });

        const buffer = Buffer.from(res.data);

        await conn.sendMessage(m.chat, {
            video: buffer,
            caption: '🐦 *اتحمل من تويتر/X*',
            mimetype: 'video/mp4'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تويتر'];
handler.command = ['تويتر', 'twitter', 'x', 'twitterdl'];
handler.category = 'download';

export default handler;
