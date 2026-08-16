// ════════════════════════════════════════
//  ourin-pakasir.js — Compatibility shim
//  تكامل مع بوابة الدفع Pakasir (بوابة إندونيسية حقيقية عن طريق QRIS).
//  ⚠️ يحتاج مفتاح API حقيقي في config.js -> APIkey.pakasir عشان يشتغل فعلياً.
// ════════════════════════════════════════
import axios from 'axios';
import config from '../../config.js';

export function isEnabled() {
    return !!config.APIkey?.pakasir;
}

export function getConfig() {
    return { apiKey: config.APIkey?.pakasir || '', slug: config.pakasir?.slug || '' };
}

export function generateOrderId() {
    return 'ORD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function createTransaction(amount, orderId) {
    const { apiKey, slug } = getConfig();
    if (!apiKey) throw new Error('لسه ماتحطش مفتاح Pakasir في config.js');
    const res = await axios.post(`https://pakasir.zone.id/api/transactioncreate`, {
        project: slug, amount, order_id: orderId
    }, { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 20000 });
    return res.data;
}

export async function cancelTransaction(orderId) {
    const { apiKey, slug } = getConfig();
    const res = await axios.post(`https://pakasir.zone.id/api/transactioncancel`, {
        project: slug, order_id: orderId
    }, { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 20000 });
    return res.data;
}

export default { isEnabled, getConfig, generateOrderId, createTransaction, cancelTransaction };
