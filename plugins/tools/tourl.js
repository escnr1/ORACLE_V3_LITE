import axios from 'axios';
import FormData from 'form-data';

async function رفع_ملف(buffer, اسم_ملف, نوع_mime) {
    const form = new FormData();
    form.append('file', buffer, {
        filename: اسم_ملف,
        contentType: نوع_mime
    });

    // نجرب tmpfiles.org أولاً
    try {
        const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
            headers: form.getHeaders(),
            timeout: 60000
        });
        if (res.data?.data?.url) {
            // تحويل الرابط للتنزيل المباشر
            return res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        }
    } catch {}

    // بديل: telegra.ph
    try {
        const form2 = new FormData();
        form2.append('file', buffer, {
            filename: اسم_ملف,
            contentType: نوع_mime
        });
        const res2 = await axios.post('https://telegra.ph/upload', form2, {
            headers: form2.getHeaders(),
            timeout: 60000
        });
        if (res2.data?.[0]?.src) {
            return 'https://telegra.ph' + res2.data[0].src;
        }
    } catch {}

    // بديل آخر: qu.ax
    const form3 = new FormData();
    form3.append('files[]', buffer, {
        filename: اسم_ملف,
        contentType: نوع_mime
    });
    const res3 = await axios.post('https://qu.ax/upload.php', form3, {
        headers: form3.getHeaders(),
        timeout: 60000
    });
    if (res3.data?.files?.[0]?.url) return res3.data.files[0].url;

    throw new Error('الرفع مضربش على كل السيرفرات');
}

const handler = async (m, { conn, text }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime) {
        return m.reply('*❌ رد على صورة أو ملف عشان أرفعه وأعطيك رابطه*');
    }

    m.react('⏳');
    try {
        const buffer = await q.download();
        
        // تحديد نوع الملف
        const ext = mime.split('/').pop()?.split(';')[0] || 'bin';
        const اسم = `file_${Date.now()}.${ext}`;

        const رابط = await رفع_ملف(buffer, اسم, mime);

        await conn.sendMessage(m.chat, {
            text: `✅ *الملف اترفع تمام*\n\n🔗 *الرابط:*\n${رابط}\n\n> الرابط صالح لفترة محدودة`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الرفع مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['لرابط2'];
handler.command = ['لرابط3', 'tourl', 'ارفع_ملف'];
handler.category = 'tools';

export default handler;
