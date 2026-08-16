import axios from 'axios';

async function بحث_يوتيوب(عنوان) {
    const res = await axios.get('https://www.youtube.com/results', {
        params: { search_query: عنوان },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
        },
        timeout: 20000
    });

    const match = res.data.match(/\/watch\?v=([\w-]{11})/);
    if (!match) throw new Error('مالقيتش الأغنية على يوتيوب');
    return `https://youtube.com/watch?v=${match[1]}`;
}

async function معلومات_سبوتيفاي(رابط) {
    // نستخدم oEmbed API
    const res = await axios.get('https://open.spotify.com/oembed', {
        params: { url: رابط },
        headers: {
            'User-Agent': 'Mozilla/5.0',
        },
        timeout: 20000
    });

    return {
        عنوان: res.data.title || 'Spotify Track',
        صورة: res.data.thumbnail_url
    };
}

async function تحميل_mp3(رابط_يوتيوب) {
    // نستخدم y2mate API
    const id = رابط_يوتيوب.match(/[?&]v=([\w-]{11})/)?.[1];
    if (!id) throw new Error('لينك اليوتيوب غلط');

    const res = await axios.post('https://www.y2mate.com/mates/analyzeV2/ajax', {
        k_query: رابط_يوتيوب,
        k_page: 'home',
        hl: 'ar',
        q_auto: 0
    }, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0'
        },
        timeout: 30000
    });

    const key = res.data.links?.mp3?.mp3128?.k;
    if (!key) throw new Error('مقدرتش أجيب رابط التحميل');

    const res2 = await axios.post('https://www.y2mate.com/mates/convertV2/index', {
        vid: id,
        k: key
    }, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0'
        },
        timeout: 30000
    });

    const دل = res2.data?.dlink;
    if (!دل) throw new Error('مقدرتش أجيب رابط MP3');

    const audio_res = await axios.get(دل, { responseType: 'arraybuffer', timeout: 60000 });
    return Buffer.from(audio_res.data);
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply(
            '*🎵 تحميل سبوتيفاي*\n\n' +
            '*طريقة الاستخدام:*\n' +
            '• .سبوتيفاي https://open.spotify.com/track/...\n\n' +
            '*ملاحظة:* الأغنية بتتحمل عن طريق يوتيوب بجودة عالية'
        );
    }

    if (!text.includes('spotify.com') && !text.includes('spotify.link')) {
        return m.reply('*❌ الرابط مش من سبوتيفاي*');
    }

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بجيب الأغنية...*');

    try {
        // جلب معلومات الأغنية
        const معلومات = await معلومات_سبوتيفاي(text.trim());

        // بحث على يوتيوب
        const yt_رابط = await بحث_يوتيوب(معلومات.عنوان);

        // تحميل MP3
        const buffer = await تحميل_mp3(yt_رابط);

        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${معلومات.عنوان}.mp3`,
            ptt: false,
            caption: `🎵 *${معلومات.عنوان}*\n\n> اتحمل عن طريق سبوتيفاي`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['سبوتيفاي'];
handler.command = ['سبوتيفاي', 'spotify', 'spotifydl'];
handler.category = 'download';

export default handler;
