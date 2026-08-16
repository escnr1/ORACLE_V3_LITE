// نظام إيقاف/تشغيل أوامر أو أقسام - للمطورين فقط
import fs   from 'fs';
import path from 'path';

const MSG_CMD = '*「💥」 الامـر دا أوراكل مـطـوري مـوقـفـو*';
const MSG_CAT = '*「💥」 الـقـسـم دا أوراكل مـطـوري مـوقـفـو*';

const getStore = () => {
    if (!global._gs)           global._gs = {};
    if (!global._gs.__system)  global._gs.__system = {};
    const s = global._gs.__system;
    if (!Array.isArray(s.disabledCommands))   s.disabledCommands   = [];
    if (!Array.isArray(s.disabledCategories)) s.disabledCategories = [];
    return s;
};

// ─ بناء خريطة الأوامر بدون groupMetadata ─
let _cmdMap = null, _cmdMapAt = 0;
const buildCmdMap = (base) => {
    const now = Date.now();
    if (_cmdMap && now - _cmdMapAt < 60_000) return _cmdMap;
    const map = {};
    const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const item of fs.readdirSync(dir)) {
            const p = path.join(dir, item);
            try {
                const st = fs.statSync(p);
                if (st.isDirectory()) { walk(p); continue; }
                if (!item.endsWith('.js')) continue;
                const src  = fs.readFileSync(p, 'utf8');
                const catM = src.match(/\.category\s*=\s*['"]([^'"]+)['"]/);
                const cat  = catM?.[1] || path.basename(path.dirname(p));
                const arrM = src.match(/\.command\s*=\s*\[([^\]]*)\]/);
                if (arrM) arrM[1].split(',').forEach(s => {
                    const v = s.trim().replace(/^['"]|['"]$/g, '');
                    if (v) map[v.toLowerCase()] = cat;
                });
                const sinM = src.match(/\.command\s*=\s*['"]([^'"]+)['"]/);
                if (sinM) map[sinM[1].toLowerCase()] = cat;
            } catch {}
        }
    };
    walk(base);
    _cmdMap = map; _cmdMapAt = now;
    return map;
};

const extractCmd = (body, prefixes) => {
    if (!body) return null;
    const arr = Array.isArray(prefixes) ? prefixes : [prefixes];
    for (const p of arr) {
        if (body.startsWith(p))
            return body.slice(p.length).split(/\s+/)[0]?.toLowerCase() || null;
    }
    return null;
};

// ══ Handler ══
const handler = async (m, { conn, bot, command, text }) => {
    if (!m.isOwner) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');

    const s   = getStore();
    const pfx = bot?.config?.prefix || ['.','/',  '!'];

    // إزالة أي prefix من الـ arg
    let arg = (text || '').trim();
    const pfxArr = Array.isArray(pfx) ? pfx : [pfx];
    for (const p of pfxArr) { if (arg.startsWith(p)) { arg = arg.slice(p.length); break; } }
    arg = arg.toLowerCase();

    switch (command) {

        case 'ايقاف_امر': case 'ايقاف-امر': case 'stop_cmd': {
            if (!arg) return m.reply('*📌 مثال:* `.ايقاف_امر بنك`');
            if (!s.disabledCommands.includes(arg)) s.disabledCommands.push(arg);
            _cmdMap = null;
            return m.reply(`✅ *الأمر اتقفل:* \`${arg}\`\n> أي شخص يكتبه هيوصله رسالة الإيقاف`);
        }

        case 'تشغيل_امر': case 'تشغيل-امر': case 'start_cmd': {
            if (!arg) return m.reply('*📌 مثال:* `.تشغيل_امر بنك`');
            if (!s.disabledCommands.includes(arg)) return m.reply(`*ℹ️ الأمر \`${arg}\` مش موقف أصلاً*`);
            s.disabledCommands = s.disabledCommands.filter(c => c !== arg);
            _cmdMap = null;
            return m.reply(`✅ *الأمر اتشغل:* \`${arg}\``);
        }

        case 'ايقاف_قسم': case 'ايقاف-قسم': case 'stop_cat': {
            if (!arg) return m.reply('*📌 مثال:* `.ايقاف_قسم bank`\n\n*.الاقسام* لعرض الأسماء');
            if (!s.disabledCategories.includes(arg)) s.disabledCategories.push(arg);
            _cmdMap = null;
            return m.reply(`✅ *القسم اتقفل:* \`${arg}\``);
        }

        case 'تشغيل_قسم': case 'تشغيل-قسم': case 'start_cat': {
            if (!arg) return m.reply('*📌 مثال:* `.تشغيل_قسم bank`');
            if (!s.disabledCategories.includes(arg)) return m.reply(`*ℹ️ القسم \`${arg}\` مش موقف أصلاً*`);
            s.disabledCategories = s.disabledCategories.filter(c => c !== arg);
            _cmdMap = null;
            return m.reply(`✅ *القسم اتشغل:* \`${arg}\``);
        }

        case 'الاوامر_الموقفه': case 'الاقسام_الموقفه': case 'الموقف': {
            const cmds = s.disabledCommands.length  ? s.disabledCommands.map(c  => `• ${c}`).join('\n') : '— مفيش —';
            const cats = s.disabledCategories.length ? s.disabledCategories.map(c => `• ${c}`).join('\n') : '— مفيش —';
            return m.reply(`*🚫 الأوامر الموقفة:*\n${cmds}\n\n*🚫 الأقسام الموقفة:*\n${cats}`);
        }

        case 'الاقسام': {
            const base = bot?.config?.commandsPath || './plugins';
            const map  = buildCmdMap(base);
            const cats = [...new Set(Object.values(map))].sort();
            return m.reply(`*📂 الأقسام الموجودة:*\n\n${cats.map(c => `• ${c}`).join('\n')}`);
        }
    }
};

// ─ before hook - بيشتغل قبل كل رسالة بدون groupMetadata ─
handler.before = async (m, ctx, bot) => {
    const s = getStore();
    if (!s.disabledCommands.length && !s.disabledCategories.length) return false;
    if (m.isOwner) return false;

    const pfx    = (bot || ctx?.bot)?.config?.prefix || ['.','/',  '!'];
    const body   = (m.body || m.text || '').trim();
    const cmd    = extractCmd(body, pfx);
    if (!cmd) return false;

    if (s.disabledCommands.includes(cmd)) {
        try { await m.reply(MSG_CMD); } catch {}
        return true;
    }

    if (s.disabledCategories.length) {
        const base = (bot || ctx?.bot)?.config?.commandsPath || './plugins';
        const map  = buildCmdMap(base);
        const cat  = map[cmd];
        if (cat && s.disabledCategories.includes(cat)) {
            try { await m.reply(MSG_CAT); } catch {}
            return true;
        }
    }

    return false;
};

handler.usage    = ['ايقاف_امر','تشغيل_امر','ايقاف_قسم','تشغيل_قسم','الموقف','الاقسام'];
handler.category = 'settings';
handler.command  = [
    'ايقاف_امر','تشغيل_امر','ايقاف-امر','تشغيل-امر','stop_cmd','start_cmd',
    'ايقاف_قسم','تشغيل_قسم','ايقاف-قسم','تشغيل-قسم','stop_cat','start_cat',
    'الاوامر_الموقفه','الاقسام_الموقفه','الموقف','الاقسام'
];
handler.owner = true;

export default handler;
