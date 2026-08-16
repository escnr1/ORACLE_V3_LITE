const UPDATE_MSG = `جّـــــآريَ تٌحًمًــــيَلَ تٍــًحَـديْــٍثً الـٌبـوٌتَ
██████▓▓▒▒ 99% .....📲`;

export default async function before(m, { conn, bot }) {
    if (!global.updateMode) return false;

    // المطور يقدر يستخدم البوت
    const isOwner = bot?.config?.owners?.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );
    if (isOwner) return false;

    // كشف أي رسالة فيها prefix (. أو / أو !)
    const text = m.text || m.body || m.message?.conversation || '';
    const hasCommand = /^[./!]/.test(text.trim());

    if (!hasCommand) return false;

    try {
        await conn.sendMessage(m.chat, {
            text: UPDATE_MSG
        }, { quoted: m });
    } catch {}

    return true;
}
