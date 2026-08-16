// ourin-auto-jpm.js — Compatibility shim: جدولة البث التلقائي للجروبات
import fs from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'system', 'auto-jpm');
const FILE = path.join(DIR, 'config.json');
let _timer = null;

export function getAutoJpmStorageDir() {
    fs.mkdirSync(DIR, { recursive: true });
    return DIR;
}

export function getAutoJpmConfig() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return { enabled: false, message: '', intervalMinutes: 60 }; }
}

export function setAutoJpmConfig(cfg) {
    getAutoJpmStorageDir();
    fs.writeFileSync(FILE, JSON.stringify(cfg, null, 2));
}

export function startAutoJpmScheduler(sock) {
    stopAutoJpmScheduler();
    const cfg = getAutoJpmConfig();
    if (!cfg.enabled) return;
    _timer = setInterval(async () => {
        try {
            const groups = await sock.groupFetchAllParticipating?.();
            if (!groups) return;
            for (const gid of Object.keys(groups)) {
                await sock.sendMessage(gid, { text: cfg.message || '' }).catch(() => {});
            }
        } catch {}
    }, Math.max(5, cfg.intervalMinutes || 60) * 60 * 1000);
}

export function stopAutoJpmScheduler() {
    if (_timer) { clearInterval(_timer); _timer = null; }
}

export default { getAutoJpmConfig, setAutoJpmConfig, startAutoJpmScheduler, stopAutoJpmScheduler, getAutoJpmStorageDir };
