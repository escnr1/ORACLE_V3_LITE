import { sendSectionList } from './menu_builder.js';
import { getCat, CATEGORIES } from '../system/categories.js';

async function handler(m, { conn, bot, args }) {
    const selected = parseInt(args[0]);
    const cat = getCat(selected);

    if (!cat) {
        await conn.sendMessage(m.chat, { text: `*❌ اختار رقم صح من 1 لـ ${CATEGORIES.length}*` }, { quoted: m });
        return;
    }

    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    if (cat[2] === 'owner' && !isOwner) {
        await conn.sendMessage(m.chat, { text: '*❌ القسم ده للمطورين بس 🇦🇱*' }, { quoted: m });
        return;
    }

    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);

    if (!categoryCmds.length) {
        await conn.sendMessage(m.chat, { text: '*❌ القسم ده لسه فاضي*' }, { quoted: m });
        return;
    }

    const rows = categoryCmds
        .filter(c => Array.isArray(c.usage) && c.usage.length > 0)
        .flatMap(c => c.usage.map(u => ({ cmd: u, desc: c.desc || cat[1] })))
        .filter(r => r.cmd && r.cmd !== 'undefined');

    await sendSectionList(m, { conn, bot }, {
        sectionTitle: cat[1],
        sectionEmoji: cat[3],
        rows
    });
}

handler.command = ['قايمة_اوامر'];
handler.category = 'main';
export default handler;
