// مكتبة مساعدة مشتركة لكل أوامر اللعبة (rpg) - بتشتغل فوق نفس global.db اللي بيستخدمه بنك.js

export const DEFAULT_PIC = 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg';

export const formatNumber = (n) => Number(n || 0).toLocaleString('en');

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getUser = (sender) => {
    if (!global.db?.users) return null;
    const u = global.db.users[sender] || {};
    return {
        xp: Number(u.xp) || 0,
        coins: Number(u.coins) || 0,
        diamonds: Number(u.diamonds) || 0,
        dollars: Number(u.dollars) || 0,
        level: Number(u.level) || 0,
        msgcount: Number(u.msgcount) || 0,
        hp: u.hp === undefined ? 100 : Number(u.hp),
        maxHp: Number(u.maxHp) || 100,
        power: Number(u.power) || 10,
        stamina: u.stamina === undefined ? 100 : Number(u.stamina),
        inventory: u.inventory || {},
        pet: u.pet || null,
        clan: u.clan || null,
        ...u
    };
};

export const saveUser = (sender, user) => {
    if (!global.db?.users) return false;
    const current = global.db.users[sender] || {};
    Object.assign(current, user);
    global.db.users[sender] = current;
    return true;
};

export const getClans = () => {
    if (!global.db) return {};
    if (!global.db.clans) global.db.clans = {};
    return global.db.clans;
};

export const saveClan = (name, clan) => {
    const clans = getClans();
    clans[name] = clan;
    global.db.clans = clans;
};

export const bar = (percent, size = 10) => {
    const filled = Math.max(0, Math.min(size, Math.round((percent / 100) * size)));
    return '▰'.repeat(filled) + '▱'.repeat(size - filled);
};

// بيتأكد إن قاعدة البيانات شغالة، وبيرجع رسالة خطأ موحدة لو مش شغالة
export const dbReady = (m) => {
    if (!global.db?.users) {
        m.reply('*❌ قاعدة البيانات مش شغالة دلوقتي، جرب تاني بعد شوية*');
        return false;
    }
    return true;
};

// بيتأكد إن الوقت اللي فات كافي، وبيرجع النص المتبقي لو لسه بدري
export const checkCooldown = (lastTimestamp, cooldownMs) => {
    const now = Date.now();
    const remaining = cooldownMs - (now - (lastTimestamp || 0));
    if (remaining <= 0) return { ready: true, now };
    const h = Math.floor(remaining / 3600000);
    const mnt = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    let txt = '';
    if (h > 0) txt = `${h} ساعة و${mnt} دقيقة`;
    else if (mnt > 0) txt = `${mnt} دقيقة و${s} ثانية`;
    else txt = `${s} ثانية`;
    return { ready: false, remainingText: txt };
};

export const getProfilePic = async (conn, jid) => {
    try {
        const url = await conn.profilePictureUrl(jid, 'image');
        if (url && typeof url === 'string') return url;
    } catch {}
    return DEFAULT_PIC;
};
