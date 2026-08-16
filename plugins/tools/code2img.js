/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const الثيمات = ['dracula', 'nord', 'vsc-dark-plus', 'material-dark', 'synthwave84', 'atom-dark'];
const اللغات = ['javascript', 'python', 'java', 'html', 'css', 'typescript', 'cpp', 'rust', 'go'];

async function كود_لصورة(كود, لغة = 'javascript', ثيم = 'dracula') {
    const رابط = `https://code2img.vercel.app/api/to-image?theme=${ثيم}&language=${لغة}&line-numbers=true&background=true`;
    const res = await axios.post(رابط, { code: كود }, {
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
        responseType: 'arraybuffer',
        timeout: 30000
    });
    return Buffer.from(res.data);
}

function كشف_لغة(كود) {
    if (/^import .* from|const .* =|let .* =|async function/.test(كود)) return 'javascript';
    if (/^def |^import |^class .*:/.test(كود)) return 'python';
    if (/public class|System\.out/.test(كود)) return 'java';
    if (/<!DOCTYPE|<html/.test(كود)) return 'html';
    return 'javascript';
}

const handler = async (m, { conn, text, args }) => {
    let كود = text;
    let لغة = 'javascript';
    let ثيم = 'dracula';

    if (!كود && !m.quoted?.text) {
        return m.reply(
            `*💻 تحويل كود لصورة*\n${'━'.repeat(30)}\n\n` +
            `*طريقة الاستخدام:*\n.كود_صورة [لغة] [ثيم]\n[الكود هنا]\n\n` +
            `*الثيمات:* ${الثيمات.join(', ')}\n` +
            `*اللغات:* ${اللغات.join(', ')}\n\n` +
            `*مثال:*\n.كود_صورة python nord\nprint("أهلاً بيك")\n\n` +
            `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        );
    }

    if (m.quoted?.text && !كود) كود = m.quoted.text;

    // استخراج اللغة والثيم من أول سطر
    const أسطر = كود.split('\n');
    const أول_سطر = أسطر[0].trim().toLowerCase();
    for (const ل of اللغات) {
        if (أول_سطر.includes(ل)) { لغة = ل; كود = أسطر.slice(1).join('\n'); break; }
    }
    for (const ث of الثيمات) {
        if (أول_سطر.includes(ث)) { ثيم = ث; break; }
    }
    if (لغة === 'javascript') لغة = كشف_لغة(كود);

    m.react('⏳');
    try {
        const صورة = await كود_لصورة(كود.trim(), لغة, ثيم);
        await conn.sendMessage(m.chat, {
            image: صورة,
            caption: `💻 *كود ${لغة} — ثيم ${ثيم}*\n\n> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ التحويل مضربش:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['كود_صورة'];
handler.command = ['كود_صورة', 'code2img', 'codeimg'];
handler.category = 'tools';

export default handler;
