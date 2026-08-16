// ourin-panel-jeda.js — Compatibility shim: تهدئة (cooldown) بين أوامر البانل
const lastUsed = new Map();
const DEFAULT_JEDA_MS = 10000;

export function checkPanelJeda(jid) {
    const last = lastUsed.get(jid) || 0;
    const remaining = DEFAULT_JEDA_MS - (Date.now() - last);
    return remaining > 0 ? remaining : 0;
}

export function setPanelLastUsed(jid) {
    lastUsed.set(jid, Date.now());
}

export default { checkPanelJeda, setPanelLastUsed };
