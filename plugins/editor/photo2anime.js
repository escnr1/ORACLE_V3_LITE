/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import sharp from 'sharp';

function عشوائي_IP() {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

const IP_جلسة = عشوائي_IP();

function رؤوس_الطلب() {
    return {
        'fp': 'c74f54010942b009eaa50cd58a1f4419',
        'fp1': '3LXezMA2LSO2kESzl2EYNEQBUWOCDQ/oQMQaeP5kWWHbtCWoiTptGi2EUCOLjkdD',
        'origin': 'https://pixnova.ai',
        'referer': 'https://pixnova.ai/',
        'accept-language': 'ar,en;q=0.9',
        'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
        'X-Forwarded-For': IP_جلسة,
        'Client-IP': IP_جلسة
    };
}

async function رفع_صورة(buffer) {
    const stream = Readable.from(buffer);
    const form = new FormData();
    form.append('file', stream, { filename: 'image.jpg' });
    form.append('fn_name', 'demo-photo2anime');
    form.append('request_from', '2');
    form.append('origin_from', '111977c0d5def647');

    const res = await axios.post('https://api.pixnova.ai/aitools/upload-img', form, {
        headers: { ...رؤوس_الطلب(), ...form.getHeaders() },
        timeout: 30000
    });
    return res.data?.data?.path;
}

async function إنشاء_مهمة(مسار_الصورة) {
    const res = await axios.post('https://api.pixnova.ai/aitools/task/create', {
        fn_name: 'demo-photo2anime',
        input_image: مسار_الصورة,
        origin_from: '111977c0d5def647'
    }, {
        headers: { ...رؤوس_الطلب(), 'content-type': 'application/json' },
        timeout: 30000
    });
    return res.data?.data?.task_id;
}

async function انتظر_النتيجة(task_id, محاولات = 20) {
    for (let i = 0; i < محاولات; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const res = await axios.post('https://api.pixnova.ai/aitools/task/result', {
            task_id,
            fn_name: 'demo-photo2anime'
        }, {
            headers: { ...رؤوس_الطلب(), 'content-type': 'application/json' },
            timeout: 15000
        });
        const حالة = res.data?.data?.status;
        if (حالة === 'success') return res.data?.data?.output_image_url || res.data?.data?.result_image;
        if (حالة === 'failed') throw new Error('التحويل مضربش على السيرفر');
    }
    throw new Error('الوقت خلص، جرب تاني');
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image')) return m.reply('*❌ رد على صورة عشان أحولها لأنمي*');

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بحوّل الصورة لأنمي...*');

    try {
        const buffer = await q.download();
        const مسار = await رفع_صورة(buffer);
        if (!مسار) throw new Error('رفع الصورة مضربش');

        const task_id = await إنشاء_مهمة(مسار);
        if (!task_id) throw new Error('إنشاء المهمة مضربش');

        const رابط_النتيجة = await انتظر_النتيجة(task_id);
        if (!رابط_النتيجة) throw new Error('مرجعتش نتيجة');

        const img_res = await axios.get(رابط_النتيجة, { responseType: 'arraybuffer', timeout: 30000 });
        const png = await sharp(Buffer.from(img_res.data)).png().toBuffer();

        await conn.sendMessage(m.chat, {
            image: png,
            caption: '✨ *الصورة اتحولت لأنمي*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحويل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['أنمي_صورة'];
handler.command = ['أنمي_صورة', 'photo2anime', 'انمي_صورة'];
handler.category = 'editor';

export default handler;
