const SUPPORT_TEAM = [
    { name: '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤', jid: '201065948582@s.whatsapp.net' },
    { name: '𝑆𝐴𝑌𝐾𝑂 ~ 𝑆𝐾',    jid: '201090406441@s.whatsapp.net' }
];

const handler = async (m, { conn }) => {
    const links = SUPPORT_TEAM.map((s, i) =>
        `${i + 1}. *${s.name}*\nhttps://wa.me/${s.jid.replace('@s.whatsapp.net', '')}`
    ).join('\n\n');

    try {
        return conn.sendButton(m.chat, {
            imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
            bodyText: `*🛡️ فريق الدعم*\n\n${links}`,
            footerText: '𝐎𝐑𝐀𝐂𝐋𝐄 Support Team',
            buttons: SUPPORT_TEAM.map(s => ({
                name: 'cta_url',
                params: {
                    display_text: `💬 ${s.name}`,
                    url: `https://wa.me/${s.jid.replace('@s.whatsapp.net', '')}`
                }
            })),
            mentions: [m.sender],
            interactiveConfig: { buttons_limits: 2 }
        }, m);
    } catch {
        return m.reply(`*🛡️ فريق الدعم*\n\n${links}`);
    }
};

handler.command  = ['فريق_الدعم', 'الدعم', 'support'];
handler.usage    = ['فريق_الدعم'];
handler.category = 'info';
export default handler;
