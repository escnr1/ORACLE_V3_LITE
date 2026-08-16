// ourin-time.js — Compatibility shim
const TZ = 'Africa/Cairo';

export function formatDate(ts = Date.now()) {
    return new Date(ts).toLocaleDateString('ar-EG', { timeZone: TZ, year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatTime(ts = Date.now()) {
    return new Date(ts).toLocaleTimeString('ar-EG', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(ts = Date.now()) {
    return `${formatDate(ts)} - ${formatTime(ts)}`;
}

export function formatFull(ts = Date.now()) {
    return new Date(ts).toLocaleString('ar-EG', { timeZone: TZ, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function fromTimestamp(ts) {
    return new Date(ts);
}

export function getCurrentTimeString() {
    return formatDateTime(Date.now());
}

export default { formatDate, formatTime, formatDateTime, formatFull, fromTimestamp, getCurrentTimeString };
