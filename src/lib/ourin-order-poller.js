// ourin-order-poller.js — Compatibility shim: تخزين وإدارة طلبات المتجر (store/)
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'system', 'orders.json');

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return {}; }
}
function save(d) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

export function createOrder(orderId, data) {
    const d = load();
    d[orderId] = { ...data, id: orderId, status: 'pending', createdAt: Date.now() };
    save(d);
    return d[orderId];
}

export function getOrder(orderId) {
    return load()[orderId] || null;
}

export function updateOrder(orderId, patch) {
    const d = load();
    if (!d[orderId]) return null;
    d[orderId] = { ...d[orderId], ...patch };
    save(d);
    return d[orderId];
}

export function getOrdersByBuyer(jid) {
    return Object.values(load()).filter(o => o.buyer === jid);
}

export function getOrdersByGroup(chatJid) {
    return Object.values(load()).filter(o => o.chat === chatJid);
}

export default { createOrder, getOrder, updateOrder, getOrdersByBuyer, getOrdersByGroup };
