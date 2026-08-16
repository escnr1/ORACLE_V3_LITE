const isOn = (val) => val && val !== 'off';

export default async function before(m, { conn, bot }) {
    const g = global.db?.groups?.[m.chat];
    const u = global.db?.users?.[m.sender];

    if (isOn(u?.banned) && !m.isOwner) return true;
    if (isOn(g?.adminOnly) && !m.isOwner && !m.isAdmin) return true;
    if (isOn(global.db?.dev) && !m.isOwner && !m.isGroup) return true;
    if (isOn(global.db?.ownerOnly) && !m.isOwner) return true;

    return false;
}
