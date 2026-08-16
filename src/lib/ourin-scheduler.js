// ourin-scheduler.js — Compatibility shim: رسائل مجدولة عامة
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'system', 'scheduled-messages.json');
const timers = new Map();

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return []; }
}
function save(d) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

export function getMsUntilTime(timestamp) {
    return Math.max(0, timestamp - Date.now());
}

export function formatTimeRemaining(ms) {
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h} ساعة و ${m % 60} دقيقة`;
    return `${m} دقيقة`;
}

export function scheduleMessage(conn, jid, text, timestamp) {
    const list = load();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    list.push({ id, jid, text, timestamp });
    save(list);

    const delay = getMsUntilTime(timestamp);
    const t = setTimeout(async () => {
        try { await conn.sendMessage(jid, { text }); } catch {}
        cancelScheduledMessage(id);
    }, delay);
    timers.set(id, t);
    return id;
}

export function cancelScheduledMessage(id) {
    const list = load().filter(m => m.id !== id);
    save(list);
    if (timers.has(id)) { clearTimeout(timers.get(id)); timers.delete(id); }
    return true;
}

export function getScheduledMessages() {
    return load();
}

export function getSchedulerStatus() {
    const list = load();
    return { active: list.length, items: list };
}

export function getFullSchedulerStatus() {
    const s = getSchedulerStatus();
    return { ...s, named: Array.from(named.entries()).map(([name, v]) => ({ name, active: v.active })) };
}

// سجل عام لأي "شيدولر" مسمّى (زي limitreset/groupschedule/sewa/sholat...) عشان
// أوامر startschedule/stopschedule تقدر توقفه/تشغله بالاسم. أي ملف تاني في
// البوت يقدر يسجل نفسه هنا بـ registerScheduler عشان يبقى قابل للتحكم.
const named = new Map();

export function registerScheduler(name, startFn, stopFn) {
    named.set(name, { startFn, stopFn, active: false });
}

export function startSchedulerByName(name, sock) {
    const entry = named.get(name);
    if (!entry) return { started: false, name };
    if (entry.active) return { started: false, name };
    try {
        entry.startFn?.(sock);
        entry.active = true;
        return { started: true, name };
    } catch {
        return { started: false, name };
    }
}

export function stopSchedulerByName(name) {
    const entry = named.get(name);
    if (!entry) return { stopped: false, name };
    if (!entry.active) return { stopped: false, name };
    try {
        entry.stopFn?.();
        entry.active = false;
        return { stopped: true, name };
    } catch {
        return { stopped: false, name };
    }
}

export default {
    scheduleMessage, cancelScheduledMessage, getScheduledMessages, getSchedulerStatus,
    getFullSchedulerStatus, formatTimeRemaining, getMsUntilTime,
    registerScheduler, startSchedulerByName, stopSchedulerByName
};
