// ourin-roles-cpanel.js — Compatibility shim: أدوار إدارة السيرفرات (panel/)
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'system', 'panel-roles.json');
export const VALID_SERVERS = ['v1', 'v2', 'v3', 'v4', 'v5'];

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return {}; }
}
function save(data) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getRoles() { return load(); }

export function addRole(jid, role) {
    const data = load();
    data[jid] = role;
    save(data);
    return true;
}

export function removeRole(jid) {
    const data = load();
    delete data[jid];
    save(data);
    return true;
}

export function listByRole(role) {
    const data = load();
    return Object.entries(data).filter(([, r]) => r === role).map(([jid]) => jid);
}

export function getUserRole(jid) {
    return load()[jid] || null;
}

export function canManageRole(actorRole, targetRole) {
    const order = ['admin', 'reseller', 'user'];
    return order.indexOf(actorRole) < order.indexOf(targetRole);
}

export function getAccessibleServers(jid) {
    return getUserRole(jid) ? VALID_SERVERS : [];
}

export function hasAccessToServer(jid) {
    return !!getUserRole(jid);
}

// المستخدم owner البوت ليه صلاحية كاملة على أي سيرفر دايمًا. غير كده، بيتفحص
// دوره في نظام panel-roles + إن السيرفر ده من ضمن سيرفراته المسموح بيها.
export function hasFullAccess(jid, serverVersion, isOwner = false) {
    if (isOwner) return true;
    const role = getUserRole(jid);
    if (!role) return false;
    if (role === 'admin') return true;
    return getAccessibleServers(jid).includes(serverVersion);
}

export default {
    addRole, removeRole, listByRole, getUserRole, canManageRole, getRoles,
    getAccessibleServers, hasAccessToServer, hasFullAccess, VALID_SERVERS
};
