import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const تأخير = (ms) => new Promise(r => setTimeout(r, ms));

async function جلب_ستيكر(نص, محاولة = 1) {
    try {
        const res = await axios.get('https://kepolu-brat.hf.space/brat', {
            params: { q: نص },
            responseType: 'arraybuffer',
            timeout: 30000
        });
        return res.data;
    } catch (e) {
        if (e.response?.status === 429 && محاولة <= 3) {
            const انتظار = parseInt(e.response.headers['retry-after'] || '5');
            await تأخير(انتظار * 1000);
            return جلب_ستيكر(نص, محاولة + 1);
        }
        throw e;
    }
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ اكتب نص بعد الأمر*\n\nمثال: .براتي أهلاً بيك');

    m.react('⏳');
    try {
        const مجلد_tmp = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(مجلد_tmp)) fs.mkdirSync(مجلد_tmp, { recursive: true });

        const buffer = await جلب_ستيكر(text);
        const مسار_مخرج = path.join(مجلد_tmp, `brat_${Date.now()}.webp`);

        await sharp(buffer)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp({ quality: 80 })
            .toFile(مسار_مخرج);

        await conn.sendMessage(m.chat, {
            sticker: { url: مسار_مخرج }
        }, { quoted: m });

        try { fs.unlinkSync(مسار_مخرج); } catch {}
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ عمل الملصق مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['براتي'];
handler.command = ['براتي', 'brat'];
handler.category = 'sticker';

export default handler;
