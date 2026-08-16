// ════════════════════════════════════════
//  plugins/owner/link_manager.js
//  نظام إدارة الروابط: عرض كل الروابط + تعديل أي رابط وحفظه تلقائياً
//  في system/links.json من غير ما يحتاج المستخدم يلمس أي ملف كود.
// ════════════════════════════════════════
import fs from 'fs';
import path from 'path';

const LINKS_FILE = path.join(process.cwd(), 'system', 'links.json');
const TYPE_ICON = { whatsapp: '🟢', telegram: '📨', youtube: '📺', github: '🐙', website: '🌐' };

function loadLinks() {
    try { return JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8')); }
    catch { return {}; }
}

function saveLinks(links) {
    fs.mkdirSync(path.dirname(LINKS_FILE), { recursive: true });
    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
}

async function handler(m, { conn, command, text }) {
    const links = loadLinks();

    // ── .الروابط : عرض جميع الروابط مقسمة حسب النوع ──
    if (command === 'الروابط' || command === 'روابط') {
        const byType = {};
        for (const [key, info] of Object.entries(links)) {
            const t = info.type || 'website';
            byType[t] = byType[t] || [];
            byType[t].push({ key, ...info });
        }

        let msg = `╭─「 🔗 *روابط ${'𝐎𝐑𝐀𝐂𝐋𝐄 𝐕𝟑'}* 」─╮\n\n`;
        for (const [type, items] of Object.entries(byType)) {
            msg += `${TYPE_ICON[type] || '🔗'} *${type.toUpperCase()}*\n`;
            for (const it of items) {
                msg += `   • ${it.label} (\`${it.key}\`)\n     ${it.url}\n`;
            }
            msg += '\n';
        }
        msg += `> ✏️ لتغيير رابط: *.تعديل_رابط <المفتاح> <الرابط الجديد>*\n`;
        msg += `> مثال: *.تعديل_رابط group https://chat.whatsapp.com/xxxx*`;

        return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
    }

    // ── .شات_البوت : فتح تواصل مباشر مع المطور ──
    if (command === 'شات_البوت' || command === 'شات') {
        const ownerLink = links.owner?.url || 'https://wa.me/201092178171';
        return conn.sendMessage(m.chat, {
            text: `💬 *كلم المطور على طول:*\n\n${ownerLink}`
        }, { quoted: m });
    }

    // ── .تعديل_رابط <key> <url> : تعديل رابط وحفظه تلقائياً ──
    if (command === 'تعديل_رابط' || command === 'تغيير_رابط') {
        if (!m.isOwner) return m.reply('❌ الأمر ده للمطورين بس');

        const parts = (text || '').trim().split(/\s+/);
        const key = parts[0];
        const newUrl = parts[1];

        if (!key || !newUrl) {
            const keys = Object.keys(links).join(', ') || '(مفيش روابط محفوظة لسه)';
            return m.reply(
                `❌ الاستخدام: *.تعديل_رابط <المفتاح> <الرابط الجديد>*\n\n` +
                `المفاتيح الموجودة دلوقتي: ${keys}`
            );
        }
        if (!/^https?:\/\//.test(newUrl)) {
            return m.reply('❌ الرابط لازم يبدأ بـ http:// أو https://');
        }

        if (!links[key]) {
            // مفتاح جديد بالكامل: نحدد نوعه تلقائياً من شكل الرابط
            const type =
                newUrl.includes('t.me') ? 'telegram' :
                newUrl.includes('youtube.com') || newUrl.includes('youtu.be') ? 'youtube' :
                newUrl.includes('github.com') ? 'github' :
                newUrl.includes('whatsapp.com') || newUrl.includes('chat.whatsapp.com') ? 'whatsapp' :
                'website';
            links[key] = { label: key, url: newUrl, type };
        } else {
            links[key].url = newUrl;
        }

        saveLinks(links);
        return m.reply(`✅ الرابط بتاع *${key}* اتحدّث تمام:\n${newUrl}`);
    }
}

handler.command = ['الروابط', 'روابط', 'شات_البوت', 'شات', 'تعديل_رابط', 'تغيير_رابط'];
handler.category = 'owner';
handler.usage = ['.الروابط', '.تعديل_رابط <key> <url>'];
handler.description = 'عرض وتعديل جميع روابط البوت من مكان واحد';

export default handler;
