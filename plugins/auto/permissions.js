/**
 * permissions.js - يشتغل قبل كل أمر
 * بيضيف m.isOwner و m.isAdmin صح حتى في البوتات الفرعية
 */

export default async function before(m, { conn, bot }) {
    // المطورين من config أو من _mainOwners المحفوظ
    const owners = bot?.config?.owners || global._mainOwners || [];
    const botJid = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';

    const isOwner =
        owners.some(o => o.jid === m.sender || o.lid === m.sender) ||
        m.sender === botJid ||
        m.sender?.split(':')[0] + '@s.whatsapp.net' === botJid;

    // تحديث m.isOwner صح في كل الحالات
    if (isOwner) m.isOwner = true;

    return false; // استمر ولا توقف
}
