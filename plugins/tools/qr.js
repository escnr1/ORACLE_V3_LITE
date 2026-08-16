import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function انشاء_qr(نص) {
    const مجلد = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(مجلد)) fs.mkdirSync(مجلد, { recursive: true });

    const نوع = نص.startsWith('http') ? 'link' : 'text';

    const بيانات = {
        save_qr_code: 'no',
        backcolor: '#FFFFFF',
        frontcolor: '#000000',
        transparent: false,
        gradient: false,
        pattern: 'default',
        marker: 'default',
        marker_in: 'default',
        optionlogo: 'none',
        section: نوع,
        data: نوع === 'text' ? نص : '',
        link: نوع === 'link' ? نص : '',
    };

    const res = await axios.post(
        'https://qr.io/generator2/ajax/process-index.php',
        بيانات,
        {
            headers: {
                'content-type': 'application/json',
                'origin': 'https://qr.io',
                'user-agent': 'Mozilla/5.0'
            },
            timeout: 30000
        }
    );

    if (!res.data?.svgcode) throw new Error('السيرفر مرجعش QR');

    const مسار = path.join(مجلد, `qr_${Date.now()}.png`);
    await sharp(Buffer.from(res.data.svgcode))
        .resize(512, 512)
        .png()
        .toFile(مسار);

    return مسار;
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('*❌ اكتب نص أو رابط بعد الأمر*\n\nمثال: .qr https://google.com\nأو: .qr أهلاً بيك بكم');
    }

    m.react('⏳');
    try {
        const مسار = await انشاء_qr(text);

        await conn.sendMessage(m.chat, {
            image: { url: مسار },
            caption: `✅ *الـ QR Code اتعمل*\n📝 ${text.slice(0, 50)}`
        }, { quoted: m });

        try { fs.unlinkSync(مسار); } catch {}
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ عمل QR مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['qr'];
handler.command = ['qr', 'كيو_ار', 'qrcode'];
handler.category = 'tools';

export default handler;
