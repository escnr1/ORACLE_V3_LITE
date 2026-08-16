import axios from 'axios';
import FormData from 'form-data';

// API لفصل الصوت
async function فصل_الصوت(buffer_أو_رابط) {
    const form = new FormData();

    if (Buffer.isBuffer(buffer_أو_رابط)) {
        form.append('audio', buffer_أو_رابط, {
            filename: `audio_${Date.now()}.mp3`,
            contentType: 'audio/mpeg'
        });
    } else {
        // رابط مباشر
        const res = await axios.get(buffer_أو_رابط, { responseType: 'arraybuffer', timeout: 30000 });
        form.append('audio', Buffer.from(res.data), {
            filename: `audio_${Date.now()}.mp3`,
            contentType: 'audio/mpeg'
        });
    }

    // نستخدم API من x-minus
    const res = await axios.post('https://x-minus.pro/api/ai/vocal-remover/upload', form, {
        headers: {
            ...form.getHeaders(),
            'User-Agent': 'Mozilla/5.0',
            'Origin': 'https://x-minus.pro',
            'Referer': 'https://x-minus.pro/vocal-remover'
        },
        timeout: 120000
    });

    return res.data;
}

const handler = async (m, { conn, text }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.includes('audio') && !mime.includes('video') && !text) {
        return m.reply(
            '*🎵 فصل الصوت عن الموسيقى*\n\n' +
            '*طريقة الاستخدام:*\n' +
            '• رد على ملف صوت أو فيديو\n\n' +
            '*الناتج:*\n' +
            '🎤 الصوت (Vocals)\n' +
            '🎶 الموسيقى بدون صوت (Instrumental)'
        );
    }

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بفصل الصوت عن الموسيقى...*');

    try {
        let مدخل;
        if (mime.includes('audio') || mime.includes('video')) {
            مدخل = await q.download();
        } else {
            مدخل = text.trim();
        }

        const ناتج = await فصل_الصوت(مدخل);
        if (!ناتج) throw new Error('مرجعش ناتج من السيرفر');

        // إرسال الصوت المفصول
        if (ناتج.vocals || ناتج.vocal) {
            const vocal_url = ناتج.vocals || ناتج.vocal;
            const vocal_res = await axios.get(vocal_url, { responseType: 'arraybuffer' });
            await conn.sendMessage(m.chat, {
                audio: Buffer.from(vocal_res.data),
                mimetype: 'audio/mpeg',
                fileName: 'vocals.mp3',
                ptt: false,
                caption: '🎤 *الصوت المفصول (Vocals)*'
            }, { quoted: m });
        }

        // إرسال الموسيقى
        if (ناتج.music || ناتج.instrumental) {
            const music_url = ناتج.music || ناتج.instrumental;
            const music_res = await axios.get(music_url, { responseType: 'arraybuffer' });
            await conn.sendMessage(m.chat, {
                audio: Buffer.from(music_res.data),
                mimetype: 'audio/mpeg',
                fileName: 'instrumental.mp3',
                ptt: false,
                caption: '🎶 *الموسيقى بدون صوت (Instrumental)*'
            }, { quoted: m });
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فصل الصوت مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['فصل_صوت'];
handler.command = ['فصل_صوت', 'vocalremover', 'فصل-صوت'];
handler.category = 'tools';

export default handler;
