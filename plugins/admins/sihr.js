// سحر - تغيير اسم العضو مؤقتاً بردود مضحكة
const SIHR_MSGS = [
    '🔮 السحر اتحط على @{name}!\nالأعراض: مش قادر يتكلم 😂',
    '🪄 @{name} بقى ضفدع! 🐸',
    '✨ @{name} تحت تأثير الحجاب! مش قادر يتحرك 😈',
    '🌀 @{name} اتسحر! استنى 30 ثانية 🔮',
];
const handler = async (m, { conn }) => {
    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو يا معلم*');
    const msg = SIHR_MSGS[Math.floor(Math.random() * SIHR_MSGS.length)]
        .replace('{name}', target.split('@')[0]);
    await conn.sendMessage(m.chat, { text: msg, mentions: [target] }, { quoted: m });
};
handler.command  = ['سحر'];
handler.usage    = ['سحر'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
