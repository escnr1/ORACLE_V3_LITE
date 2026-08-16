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
import fs from 'fs';
import path from 'path';

async function إزالة_علامة(مسار_ملف) {
    const form = new FormData();
    form.append('image_file', fs.createReadStream(مسار_ملف), path.basename(مسار_ملف));

    const إنشاء = await axios.post(
        'https://api.ezremove.ai/api/ez-remove/watermark-remove/create-job',
        form,
        {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0',
                'origin': 'https://ezremove.ai',
                'product-serial': 'sr-' + Date.now()
            },
            timeout: 30000
        }
    );

    const job_id = إنشاء.data?.result?.job_id;
    if (!job_id) throw new Error('إنشاء المهمة مضربش');

    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 2500));

        const فحص = await axios.get(
            `https://api.ezremove.ai/api/ez-remove/watermark-remove/get-job/${job_id}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'origin': 'https://ezremove.ai',
                    'product-serial': 'sr-' + Date.now()
                },
                timeout: 15000
            }
        ).catch(() => null);

        if (فحص?.data?.code === 100000 && فحص?.data?.result?.output?.[0]) {
            return فحص.data.result.output[0];
        }
    }
    throw new Error('الوقت خلص، جرب تاني');
}

const handler = async (m, { conn }) => {
    if (!m.quoted?.mimetype) return m.reply('*❌ رد على صورة عشان أشيل العلامة المائية منها*');

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بشيل العلامة المائية...*');

    const مجلد = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(مجلد)) fs.mkdirSync(مجلد, { recursive: true });
    const مسار = path.join(مجلد, `wm_${Date.now()}.jpg`);

    try {
        const buffer = await m.quoted.download();
        fs.writeFileSync(مسار, buffer);

        const رابط_النتيجة = await إزالة_علامة(مسار);
        const ناتج = await axios.get(رابط_النتيجة, { responseType: 'arraybuffer', timeout: 30000 });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(ناتج.data),
            caption: '✅ *العلامة المائية اتشالت*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الإزالة مضربت:* ${e.message?.slice(0, 100)}`);
    } finally {
        try { fs.unlinkSync(مسار); } catch {}
    }
};

handler.usage = ['شيل_علامة'];
handler.command = ['شيل_علامة', 'rmwatermark', 'إزالة_علامة'];
handler.category = 'editor';

export default handler;
