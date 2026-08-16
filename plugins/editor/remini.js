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

async function تحسين_صورة(buffer) {
    const مجلد = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(مجلد)) fs.mkdirSync(مجلد, { recursive: true });
    const مسار = path.join(مجلد, `remini_${Date.now()}.jpg`);
    fs.writeFileSync(مسار, buffer);

    try {
        const form = new FormData();
        form.append('myfile', fs.createReadStream(مسار));
        form.append('scaleRadio', '2');

        const رفع = await axios.post('https://get1.imglarger.com/api/UpscalerNew/UploadNew', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'origin': 'https://imgupscaler.com',
                'referer': 'https://imgupscaler.com/'
            },
            timeout: 30000
        });

        const code = رفع.data?.data?.newFilename;
        if (!code) throw new Error('رفع الصورة مضربش');

        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const فحص = await axios.post('https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew', {
                code, scaleRadio: 2
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0',
                    'origin': 'https://imgupscaler.com'
                },
                timeout: 15000
            });

            const status = فحص.data?.data?.status;
            if (status === 'success' || status === '3') {
                const رابط = فحص.data?.data?.downloadFilename;
                if (رابط) {
                    const img = await axios.get(`https://get1.imglarger.com/${رابط}`, { responseType: 'arraybuffer', timeout: 30000 });
                    return Buffer.from(img.data);
                }
            }
        }
        throw new Error('الوقت خلص');
    } finally {
        try { fs.unlinkSync(مسار); } catch {}
    }
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image')) return m.reply('*❌ رد على صورة عشان أحسن جودتها*');

    m.react('⏳');
    await m.reply('*⏳ استنى بس، بحسّن الصورة...*');
    try {
        const buffer = await q.download();
        const ناتج = await تحسين_صورة(buffer);
        await conn.sendMessage(m.chat, {
            image: ناتج,
            caption: '✅ *جودة الصورة اتحسنت*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحسين مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تحسين'];
handler.command = ['تحسين', 'remini', 'hdimage', 'تحسين_صورة'];
handler.category = 'editor';

export default handler;
