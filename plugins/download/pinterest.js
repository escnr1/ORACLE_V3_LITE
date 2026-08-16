import axios from 'axios';

async function تحميل_بينتريست(رابط) {
    const res = await axios.get(`https://api.pinterest.com/v5/pins/${رابط.split('/pin/')[1]?.split('/')[0]?.split('?')[0]}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Authorization': 'Bearer MTQ3NDQ1ODM3NzMyNTIwNjcx'
        },
        timeout: 20000
    }).catch(() => null);

    // طريقة بديلة
    const res2 = await axios.get(`https://www.pinterest.com/pin/${رابط.split('/pin/')[1]?.split('/')[0]?.split('?')[0]}.json`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
            'Accept': 'application/json'
        },
        timeout: 20000
    }).catch(() => null);

    if (res2?.data) {
        const بيانات = res2.data;
        return {
            نوع: بيانات.videos ? 'video' : 'image',
            رابط_محتوى: بيانات.videos?.video_list?.V_720P?.url || 
                       بيانات.images?.orig?.url ||
                       بيانات.image_signature
        };
    }

    // ننزل الصفحة مباشرة
    const صفحة = await axios.get(رابط, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
        },
        timeout: 25000
    });

    const html = صفحة.data;
    
    // بحث عن فيديو
    const video_match = html.match(/"url":"(https:\/\/v\.pinimg\.com[^"]+\.mp4[^"]*)"/);
    if (video_match) return { نوع: 'video', رابط_محتوى: video_match[1].replace(/\\/g, '') };

    // بحث عن صورة
    const img_match = html.match(/https:\/\/i\.pinimg\.com\/originals\/[^"' ]+\.(jpg|png|gif|webp)/);
    if (img_match) return { نوع: 'image', رابط_محتوى: img_match[0] };

    throw new Error('مقدرتش أجيب المحتوى');
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('*❌ حط رابط بينتريست بعد الأمر*\n\nمثال: .بينتريست https://pinterest.com/pin/...');
    }

    if (!text.includes('pinterest') && !text.includes('pin.it')) {
        return m.reply('*❌ الرابط مش من بينتريست*');
    }

    m.react('⏳');
    try {
        const ناتج = await تحميل_بينتريست(text.trim());

        const res = await axios.get(ناتج.رابط_محتوى, {
            responseType: 'arraybuffer',
            timeout: 60000
        });

        const buffer = Buffer.from(res.data);

        if (ناتج.نوع === 'video') {
            await conn.sendMessage(m.chat, {
                video: buffer,
                caption: '📌 *اتحمل من بينتريست*',
                mimetype: 'video/mp4'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: '📌 *اتحمل من بينتريست*'
            }, { quoted: m });
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحميل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بينتريست'];
handler.command = ['بينتريست', 'pinterest'];
handler.category = 'download';

export default handler;
