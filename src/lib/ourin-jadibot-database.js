// ourin-jadibot-database.js — Compatibility shim: صلاحيات البوتات الفرعية
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'system', 'jadibot.json');

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return { owners: [], premiums: [] }; }
}
function save(data) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function addJadibotOwner(jid) {
    const d = load(); if (!d.owners.includes(jid)) d.owners.push(jid); save(d); return true;
}
export function removeJadibotOwner(jid) {
    const d = load(); d.owners = d.owners.filter(x => x !== jid); save(d); return true;
}
export function getJadibotOwners() { return load().owners; }

export function addJadibotPremium(jid) {
    const d = load(); if (!d.premiums.includes(jid)) d.premiums.push(jid); save(d); return true;
}
export function removeJadibotPremium(jid) {
    const d = load(); d.premiums = d.premiums.filter(x => x !== jid); save(d); return true;
}
export function getJadibotPremiums() { return load().premiums; }

export default { addJadibotOwner, removeJadibotOwner, getJadibotOwners, addJadibotPremium, removeJadibotPremium, getJadibotPremiums };
