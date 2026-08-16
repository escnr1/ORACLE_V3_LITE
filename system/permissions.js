/**
 * permissions.js - نظام الصلاحيات الموحد
 * 
 * المستويات:
 * 5 - مطور (owner)
 * 4 - ادمن الجروب
 * 3 - عضو عادي
 * 
 * القاعدة: لو البوت الفرعي، المطورين من config الرئيسي
 */

export const getLevel = (sender, m, bot, conn) => {
    const owners = bot?.config?.owners || global._mainOwners || [];
    const botJid = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';

    // مطور أو البوت نفسه
    if (
        owners.some(o => o.jid === sender || o.lid === sender) ||
        sender === botJid ||
        sender?.split(':')[0] + '@s.whatsapp.net' === botJid
    ) return 5;

    // ادمن الجروب
    if (m?.isAdmin || m?.isSuperAdmin) return 4;

    return 3;
};

export const isOwnerSender = (sender, bot, conn) => {
    const owners = bot?.config?.owners || global._mainOwners || [];
    const botJid = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';
    return (
        owners.some(o => o.jid === sender || o.lid === sender) ||
        sender === botJid ||
        sender?.split(':')[0] + '@s.whatsapp.net' === botJid
    );
};
