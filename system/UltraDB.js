import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class UltraDB {
    #path;
    #gsPath;
    #saveTimer = null;

    constructor() {
        this.#path   = path.join(__dirname, 'database.json');
        this.#gsPath = path.join(__dirname, 'settings.json');

        const dir = path.dirname(this.#path);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        this.data = this.#load();

        // تحميل global._gs من الملف
        global._gs = this.#loadGs();

        // حفظ تلقائي لـ _gs كل 30 ثانية
        setInterval(() => this.#saveGs(), 30000);

        return this.#createProxy();
    }

    #load() {
        try {
            if (existsSync(this.#path)) {
                const raw = readFileSync(this.#path, 'utf-8').trim();
                // تحقق إن الملف JSON صحيح قبل parse
                if (raw && raw.startsWith('{')) {
                    const parsed = JSON.parse(raw);
                    if (!parsed.groups) parsed.groups = {};
                    if (!parsed.users)  parsed.users  = {};
                    if (!parsed.extraOwners) parsed.extraOwners = [];
                    return parsed;
                }
            }
        } catch (e) {
            console.error('[UltraDB] JSON parse error, resetting:', e.message);
            // أعد إنشاء الملف لو تالف
            try { writeFileSync(this.#path, '{"groups":{},"users":{},"extraOwners":[]}'); } catch {}
        }
        return { groups: {}, users: {}, extraOwners: [] };
    }

    #loadGs() {
        try {
            if (existsSync(this.#gsPath)) {
                const raw = readFileSync(this.#gsPath, 'utf-8').trim();
                if (raw && raw.startsWith('{')) return JSON.parse(raw);
            }
        } catch (e) {
            console.error('[UltraDB] Settings JSON error, resetting:', e.message);
            try { writeFileSync(this.#gsPath, '{}'); } catch {}
        }
        return {};
    }

    #save() {
        if (this.#saveTimer) clearTimeout(this.#saveTimer);
        this.#saveTimer = setTimeout(() => {
            try { writeFileSync(this.#path, JSON.stringify(this.data, null, 2)); } catch {}
            this.#saveTimer = null;
        }, 50);
    }

    #saveGs() {
        try {
            if (global._gs) writeFileSync(this.#gsPath, JSON.stringify(global._gs, null, 2));
        } catch {}
    }

    #isValidId(id) {
        return id && !id.includes('@newsletter') && id.includes('@');
    }

    #createProxy() {
        const self = this;
        return new Proxy(this.data, {
            get(target, prop) {
                if (prop === 'groups') {
                    return new Proxy(target.groups, {
                        get(groupTarget, groupId) {
                            if (!self.#isValidId(groupId)) return undefined;
                            if (!groupTarget[groupId]) groupTarget[groupId] = {};
                            return new Proxy(groupTarget[groupId], {
                                set(obj, key, val) {
                                    if (val === false || val === null || val === undefined) {
                                        delete obj[key];
                                    } else {
                                        obj[key] = val;
                                    }
                                    self.#save();
                                    return true;
                                },
                                get(obj, key) { return obj[key]; },
                                deleteProperty(obj, key) { delete obj[key]; self.#save(); return true; }
                            });
                        },
                        set(groupTarget, groupId, val) {
                            if (self.#isValidId(groupId)) groupTarget[groupId] = val || {};
                            self.#save();
                            return true;
                        }
                    });
                }
                if (prop === 'users') {
                    return new Proxy(target.users, {
                        get(usersTarget, userId) {
                            if (!userId || userId === 'undefined') return undefined;
                            if (!usersTarget[userId]) usersTarget[userId] = {};
                            return new Proxy(usersTarget[userId], {
                                set(obj, key, val) {
                                    if (val === false || val === null || val === undefined) {
                                        delete obj[key];
                                    } else {
                                        obj[key] = val;
                                    }
                                    self.#save();
                                    return true;
                                },
                                get(obj, key) { return obj[key]; },
                                deleteProperty(obj, key) { delete obj[key]; self.#save(); return true; }
                            });
                        },
                        set(usersTarget, userId, val) {
                            if (userId && userId !== 'undefined') usersTarget[userId] = val || {};
                            self.#save();
                            return true;
                        }
                    });
                }
                if (prop === 'extraOwners') return target.extraOwners || [];
                return target[prop];
            },
            set(target, prop, val) {
                if (val === false || val === null || val === undefined) {
                    delete target[prop];
                } else {
                    target[prop] = val;
                }
                self.#save();
                return true;
            },
            deleteProperty(target, prop) {
                delete target[prop];
                self.#save();
                return true;
            }
        });
    }
}

export default UltraDB;
