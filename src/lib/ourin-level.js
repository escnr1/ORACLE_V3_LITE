// ourin-level.js — Compatibility shim
import { getDatabase } from './ourin-database.js';

export function calculateLevel(exp = 0) {
    return Math.max(1, Math.floor(Math.sqrt(exp / 100)) + 1);
}

export function getRole(level = 1) {
    if (level >= 50) return 'أسطورة';
    if (level >= 30) return 'محترف';
    if (level >= 15) return 'متقدم';
    if (level >= 5) return 'متوسط';
    return 'مبتدئ';
}

export function addExpWithLevelCheck(jid, amount) {
    const db = getDatabase();
    const user = db.getUser(jid) || db.setUser(jid, {});
    const oldLevel = calculateLevel(user.exp || 0);
    const newExp = (user.exp || 0) + amount;
    const newLevel = calculateLevel(newExp);
    db.setUser(jid, { exp: newExp, level: newLevel });
    return { exp: newExp, level: newLevel, leveledUp: newLevel > oldLevel };
}

export default { calculateLevel, getRole, addExpWithLevelCheck };
