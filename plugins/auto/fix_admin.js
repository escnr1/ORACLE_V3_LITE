// صلح مشكلة isAdmin - لما sender بييجي بصيغة @lid
// الـ framework بيقارن أرقام فقط، لكن @lid IDs مختلفة عن phoneNumber
export default async function before(m, { conn }) {
    if (!m.isGroup || m.isAdmin) return false;

    // لو isAdmin = false جرب نتحقق يدوياً
    try {
        const meta = await conn.groupMetadata(m.chat);
        const admins = meta.participants.filter(p =>
            p.admin === 'admin' || p.admin === 'superadmin'
        );

        const senderNum = m.sender.split('@')[0].split(':')[0];

        const isActuallyAdmin = admins.some(a => {
            const phoneNum = (a.phoneNumber || a.id || '').split('@')[0].split(':')[0];
            return phoneNum === senderNum || a.id === m.sender || a.phoneNumber === m.sender;
        });

        if (isActuallyAdmin) {
            // override isAdmin
            m.isAdmin = true;
        }
    } catch {}

    return false;
}
