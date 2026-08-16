// ourin-auto-backup.js — Compatibility shim
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'system', 'auto-backup.json');
let _timer = null;

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return { enabled: false, intervalHours: 24, targetJid: null, lastRun: null }; }
}
function save(d) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

export function enableAutoBackup(targetJid, intervalHours = 24) {
    save({ enabled: true, intervalHours, targetJid, lastRun: null });
    return true;
}

export function disableAutoBackup() {
    const d = load(); d.enabled = false; save(d);
    if (_timer) { clearInterval(_timer); _timer = null; }
    return true;
}

export function getBackupStatus() {
    return load();
}

export async function triggerManualBackup(conn) {
    const { sendStoreBackup } = await import('./ourin-store-backup.js');
    const d = load();
    if (!d.targetJid) return false;
    const ok = await sendStoreBackup(conn, d.targetJid);
    d.lastRun = Date.now();
    save(d);
    return ok;
}

export function formatInterval(hours) {
    return hours >= 24 ? `${Math.round(hours / 24)} يوم` : `${hours} ساعة`;
}

export default { enableAutoBackup, disableAutoBackup, getBackupStatus, triggerManualBackup, formatInterval };
