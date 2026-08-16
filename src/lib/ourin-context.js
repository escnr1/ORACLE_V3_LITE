// ourin-context.js — Compatibility shim: بيانات مختصرة للسياق (RPG/ألعاب)
import { getDatabase } from './ourin-database.js';

export function getRpgContextInfo(m) {
    const db = getDatabase();
    const user = db.getUser(m?.sender) || {};
    return {
        koin: user.koin || 0,
        exp: user.exp || 0,
        level: user.level || 1,
        energi: user.energi ?? 10
    };
}

export function getGameContextInfo(m) {
    return getRpgContextInfo(m);
}

export default { getRpgContextInfo, getGameContextInfo };
