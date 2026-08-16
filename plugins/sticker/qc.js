/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn, args }) => {
    let نص;
    if (args.length >= 1) {
        نص = args.join(' ');
    } else if (m.quoted?.text) {
        نص = m.quoted.text;
    } else {
        return m.reply('*❌ اكتب نص بعد الأمر أو رد على رسالة*\n\nمثال: .اقتباس_ملصق أهلاً بيك بالعالم');
    }

    if (نص.length > 100) return m.reply('*❌ النص أطول من 100 حرف*');

    m.react('⏳');
    try {
        const من = m.quoted ? m.quoted.sender : m.sender;
        const اسم = m.quoted ? (m.quoted.name || 'مجهول') : (m.name || 'مجهول');
        const صورة_بروفايل = await conn.profilePictureUrl(من, 'image').catch(() => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

        const إنشاء_ستيكر = async (لون_خلفية) => {
            const بيانات = {
                type: 'quote',
                format: 'png',
                backgroundColor: لون_خلفية,
                width: 512,
                height: 768,
                scale: 2,
                messages: [{
                    entities: [],
                    avatar: true,
                    from: {
                        id: 1,
                        name: اسم,
                        photo: { url: صورة_بروفايل }
                    },
                    text: نص,
                    replyMessage: {}
                }]
            };
            const res = await axios.post('https://qc.botcahx.eu.org/generate', بيانات, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });
            return Buffer.from(res.data.result.image, 'base64');
        };

        // إنشاء نسختين أبيض وأسود
        const [أبيض, أسود] = await Promise.all([
            إنشاء_ستيكر('#ffffff'),
            إنشاء_ستيكر('#1a1a1a')
        ]);

        for (const buf of [أبيض, أسود]) {
            const sticker = await new Sticker(buf, {
                pack: '𝐎𝐑𝐀𝐂𝐋𝐄',
                author: 'ORACLE',
                type: 'full'
            }).toBuffer();
            await conn.sendMessage(m.chat, { sticker }, { quoted: m });
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ عمل الملصق مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['اقتباس_ملصق'];
handler.command = ['اقتباس_ملصق', 'qc', 'quotely'];
handler.category = 'sticker';

export default handler;
