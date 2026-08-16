import { sendMainMenu, sendSectionMenu } from './menu_builder.js';
import { CATEGORIES, getCat, SECTION_HIGHLIGHTS } from '../system/categories.js';

async function handler(m, { conn, bot, args }) {
    const selected = parseInt(args[0]);

    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );

    // ══ من غير رقم = القايمة الرئيسية (قايمة منسدلة فيها كل الأقسام) ══
    if (!selected && !args[0]) {
        const xp = global.db?.users?.[m.sender]?.xp || 0;
        const lvl = isOwner ? 999 : (Math.floor(Math.sqrt(xp / 100)) + 1);
        const rank = isOwner
            ? { n: 'رئيس', i: '👑' }
            : (() => {
                const ranksList = [
                    {min:1,max:5,n:'مواطن',i:'👤'},{min:6,max:10,n:'جندي',i:'🪖'},
                    {min:11,max:15,n:'عريف',i:'🎖️'},{min:16,max:20,n:'رقيب',i:'🎖️'},
                    {min:21,max:25,n:'رقيب أول',i:'🎖️'},{min:26,max:30,n:'مساعد',i:'⭐'},
                    {min:31,max:35,n:'مساعد أول',i:'⭐⭐'},{min:36,max:40,n:'ملازم',i:'🧑‍✈️'},
                    {min:41,max:45,n:'ملازم أول',i:'🧑‍✈️'},{min:46,max:55,n:'نقيب',i:'👨‍✈️'},
                    {min:56,max:65,n:'رائد',i:'👨‍✈️'},{min:66,max:75,n:'مقدم',i:'🏅'},
                    {min:76,max:90,n:'عقيد',i:'🏅'},{min:91,max:110,n:'عميد',i:'🌟'},
                    {min:111,max:130,n:'لواء',i:'🌟'},{min:131,max:160,n:'فريق',i:'⚜️'},
                    {min:161,max:200,n:'فريق أول',i:'⚜️'},{min:201,max:Infinity,n:'مشير',i:'👑'}
                ];
                return ranksList.find(r => lvl >= r.min && lvl <= r.max) || ranksList[0];
            })();
        const totalUsers = Object.keys(global.db?.users || {}).length;

        const liveCommands = await bot.getAllCommands();
        const liveCategories = new Set(liveCommands.map(c => c.category).filter(Boolean));

        const sections = CATEGORIES
            .filter(c => {
                if (!liveCategories.has(c[2])) return false;
                if (c[2] === 'owner' || c[2] === 'settings') return isOwner;
                return true;
            })
            .map(c => ({
                id: `.اوامر ${c[0]}`,
                title: `${c[3]} ${c[1]}`,
                header: 'اضغط لعرض الأوامر',
                highlight: SECTION_HIGHLIGHTS[c[2]]
            }));

        await sendMainMenu(m, { conn, bot }, {
            sections,
            user: { level: lvl, role: `${rank.i} ${rank.n}` },
            totalUsers
        });
        return;
    }

    const cat = getCat(selected);
    if (!cat) {
        await conn.sendMessage(m.chat, { text: `*❌ اختار رقم صح من 1 لـ ${CATEGORIES.length}*` }, { quoted: m });
        return;
    }

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

    const usageList = categoryCmds
        .filter(c => Array.isArray(c.usage) && c.usage.length > 0)
        .flatMap(c => c.usage.map(u => ({ cmd: u, desc: c.desc || cat[1] })))
        .filter(r => r.cmd && r.cmd !== 'undefined');

    await sendSectionMenu(m, { conn, bot }, {
        sectionId: cat[2],
        sectionTitle: cat[1],
        sectionEmoji: cat[3],
        rows: usageList,
        backCommand: 'اوامر'
    });
}

handler.command = ['اوامر'];
export default handler;
