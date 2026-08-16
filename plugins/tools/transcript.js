/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function استخراج_transcript(رابط) {
    const res = await axios.post('https://kome.ai/api/transcript', {
        video_id: رابط,
        format: true
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://kome.ai',
            'Referer': 'https://kome.ai/tools/youtube-transcript-generator',
            'User-Agent': 'Mozilla/5.0'
        },
        timeout: 30000
    });
    if (!res.data?.transcript) throw new Error('مفيش ترجمة للفيديو ده');
    return res.data.transcript;
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply(
            `*📝 استخراج نص من فيديو يوتيوب*\n${'━'.repeat(30)}\n\n` +
            `*طريقة الاستخدام:*\n.transcript [رابط يوتيوب]\n\n` +
            `*مثال:*\n.transcript https://youtu.be/xxxxx\n\n` +
            `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        );
    }

    if (!text.includes('youtube') && !text.includes('youtu.be')) {
        return m.reply('*❌ حط رابط يوتيوب صح*');
    }

    m.react('⏳');
    try {
        const نص = await استخراج_transcript(text.trim());
        const مقطع = نص.slice(0, 3000);
        await conn.sendMessage(m.chat, {
            text: `*📝 نص الفيديو:*\n${'━'.repeat(30)}\n\n${مقطع}${نص.length > 3000 ? '\n\n...[مقطوع]' : ''}\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الاستخراج مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['نص_فيديو'];
handler.command = ['نص_فيديو', 'transcript', 'yt_transcript'];
handler.category = 'tools';

export default handler;
