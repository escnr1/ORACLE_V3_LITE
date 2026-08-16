// ════════════════════════════════════════
//  ourin-database.js — Compatibility shim
//  قاعدة بيانات مركزية (users/groups/settings) بيعتمد عليها أكتر من
//  240 ملف في حزمة vonr. الأصل مبني على نمط lowdb (db.data.users[...])
//  فبنينا نفس الشكل هنا بدون الحاجة لمكتبة خارجية، مع تخزين حقيقي
//  على ملف JSON عشان البيانات متتفقدش بين تشغيلة والتانية.
// ════════════════════════════════════════
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'system', 'ourin-database.json');
let _instance = null;

function cleanKey(jid = '') {
    return String(jid).replace(/@.+/g, '');
}

function loadRaw() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
        return { users: {}, groups: {}, settings: {} };
    }
}

class OurinDatabase {
    constructor() {
        this.db = { data: loadRaw() };
        if (!this.db.data.users) this.db.data.users = {};
        if (!this.db.data.groups) this.db.data.groups = {};
        if (!this.db.data.settings) this.db.data.settings = {};
    }

    async read() {
        this.db.data = loadRaw();
        return this.db.data;
    }

    async write() {
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify(this.db.data, null, 2));
        return true;
    }

    async save() {
        return this.write();
    }

    async flushAll() {
        this.db.data = { users: {}, groups: {}, settings: {} };
        return this.write();
    }

    async readAll() {
        return this.read();
    }

    getUser(jid) {
        const key = cleanKey(jid);
        return this.db.data.users[key] || null;
    }

    setUser(jid, data = {}) {
        const key = cleanKey(jid);
        const existing = this.db.data.users[key] || {
            koin: 0, exp: 0, energi: 10, level: 1, rpg: {}
        };
        this.db.data.users[key] = { ...existing, ...data };
        this.write().catch(() => {});
        return this.db.data.users[key];
    }

    getGroup(chatJid) {
        const key = cleanKey(chatJid);
        return this.db.data.groups[key] || null;
    }

    setGroup(chatJid, data = {}) {
        const key = cleanKey(chatJid);
        const existing = this.db.data.groups[key] || {};
        this.db.data.groups[key] = { ...existing, ...data };
        this.write().catch(() => {});
        return this.db.data.groups[key];
    }

    getAllUsers() {
        return this.db.data.users;
    }

    getUserCount() {
        return Object.keys(this.db.data.users).length;
    }

    updateKoin(jid, delta) {
        const user = this.getUser(jid) || this.setUser(jid, {});
        user.koin = (user.koin || 0) + delta;
        this.setUser(jid, user);
        return user.koin;
    }

    updateExp(jid, delta) {
        const user = this.getUser(jid) || this.setUser(jid, {});
        user.exp = (user.exp || 0) + delta;
        this.setUser(jid, user);
        return user.exp;
    }

    updateEnergi(jid, delta) {
        const user = this.getUser(jid) || this.setUser(jid, {});
        user.energi = Math.max(0, (user.energi || 0) + delta);
        this.setUser(jid, user);
        return user.energi;
    }

    setting(key, value) {
        if (value === undefined) return this.db.data.settings[key];
        this.db.data.settings[key] = value;
        this.write().catch(() => {});
        return value;
    }
}

export function getDatabase() {
    if (!_instance) _instance = new OurinDatabase();
    return _instance;
}

export default { getDatabase };
