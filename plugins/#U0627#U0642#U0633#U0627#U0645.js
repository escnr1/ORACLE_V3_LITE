import { sendCategoriesList } from './menu_builder.js';
import { CATEGORIES } from '../system/categories.js';

async function handler(m, { conn, bot }) {
    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);

    const liveCommands = await bot.getAllCommands();
    const liveCategories = new Set(liveCommands.map(c => c.category).filter(Boolean));

    const visibleCats = CATEGORIES.filter(c => {
        if (!liveCategories.has(c[2])) return false;
        if (c[2] === 'owner' || c[2] === 'settings') return isOwner;
        return true;
    });

    const rows = visibleCats.map(c => ({
        id: `.اوامر ${c[0]}`,
        title: `${c[3]} ${c[1]}`
    }));

    await sendCategoriesList(m, { conn, bot }, { rows });
}

handler.command = ['اقسام'];
handler.category = 'main';
export default handler;
