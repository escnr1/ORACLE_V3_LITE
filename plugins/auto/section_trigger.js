// لما حد يكتب اسم قسم البوت يجيب القسم مباشرة
const SECTIONS = {
    'المشرفين': 'admins',
    'الادمن':   'admins',
    'المطورين': 'owner',
    'المطور':   'owner',
    'التنزيلات':'download',
    'التحميل':  'download',
    'الالعاب':  'game',
    'العاب':    'game',
    'التسلية':  'fun',
    'الدين':    'religion',
    'البنك':    'bank',
    'البوتات':  'sub',
    'السبس':    'sub',
    'الاوامر':  null, // يفتح القائمة الكاملة
};

export default async function before(m, { conn, bot }) {
    if (!m.text || m.fromMe) return false;
    // لازم يكون بنقطة أو بدونها بالضبط
    const raw = (m.text || '').trim().replace(/^[.\/!]/, '');

    const sectionKey = Object.keys(SECTIONS).find(k => raw === k);
    if (!sectionKey) return false;

    const category = SECTIONS[sectionKey];

    // جيب الأوامر من الـ category
    const commandSystem = bot?.commandSystem || global._commandSystem;
    if (!commandSystem) return false;

    try {
        const handlers = commandSystem.handlers || [];
        let cmds = [];

        if (category) {
            cmds = handlers
                .filter(h => h.category === category && h.command?.length)
                .flatMap(h => h.command || [])
                .filter((v, i, a) => a.indexOf(v) === i)
                .slice(0, 30);
        }

        if (!cmds.length) return false;

        const prefix = '.';
        const list = cmds.map(c => `> │┊ ۬.͜ـ🛡️˖ ⟨${c}☇`).join('\n');

        await conn.sendMessage(m.chat, {
            text:
                `╮••─═⊐‹﷽›⊏═─┈☇\n` +
                `╿↵ أهلاً بيك ⌊@⁨${m.pushName || 'العضو'}⌉\n` +
                `── • ◈ • ──\n` +
                `*⌝🛡️┊قسم ${sectionKey}┊🛡️⌞*\n` +
                `╮─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄›⊏═─\n` +
                `┤┌ ─✦أوامر ${sectionKey}☇\n` +
                `${list}\n` +
                `┤└─☇ـ\n` +
                `╯─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄›⊏═─`,
            mentions: [m.sender]
        }, { quoted: m });

        return true;
    } catch {}
    return false;
}
