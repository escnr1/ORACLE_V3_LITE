// ourin-notif-scheduler.js — Compatibility shim: تذكيرات (أكل/نوم..) مجدولة
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'system', 'notif-scheduler.json');

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return {}; }
}
function save(d) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

export function parseJadwal(text) {
    const m = /^(\d{1,2}):(\d{2})$/.exec((text || '').trim());
    if (!m) return null;
    return { hour: parseInt(m[1]), minute: parseInt(m[2]) };
}

function setNotif(type, jid, time, message) {
    const d = load();
    d[jid] = d[jid] || {};
    d[jid][type] = { time, message, enabled: true };
    save(d);
    return true;
}

export function setNotifMakan(jid, time, message) { return setNotif('makan', jid, time, message); }
export function setNotifTidur(jid, time, message) { return setNotif('tidur', jid, time, message); }

export function toggleNotif(jid, type) {
    const d = load();
    if (!d[jid]?.[type]) return false;
    d[jid][type].enabled = !d[jid][type].enabled;
    save(d);
    return d[jid][type].enabled;
}

export function getNotif(jid, type) {
    return load()[jid]?.[type] || null;
}

export function deleteNotif(jid, type) {
    const d = load();
    if (d[jid]) delete d[jid][type];
    save(d);
    return true;
}

export default { setNotifMakan, setNotifTidur, toggleNotif, getNotif, deleteNotif, parseJadwal };
