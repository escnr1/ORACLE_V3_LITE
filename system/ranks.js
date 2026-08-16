export const RANKS = [
    { min: 1,   max: 5,   name: 'مواطن',    icon: '👤' },
    { min: 6,   max: 10,  name: 'جندي',     icon: '🪖' },
    { min: 11,  max: 15,  name: 'عريف',     icon: '🎖️' },
    { min: 16,  max: 20,  name: 'رقيب',     icon: '🎖️' },
    { min: 21,  max: 25,  name: 'رقيب أول', icon: '🎖️' },
    { min: 26,  max: 30,  name: 'مساعد',    icon: '⭐' },
    { min: 31,  max: 35,  name: 'مساعد أول',icon: '⭐⭐' },
    { min: 36,  max: 40,  name: 'ملازم',    icon: '🧑‍✈️' },
    { min: 41,  max: 45,  name: 'ملازم أول',icon: '🧑‍✈️' },
    { min: 46,  max: 55,  name: 'نقيب',     icon: '👨‍✈️' },
    { min: 56,  max: 65,  name: 'رائد',     icon: '👨‍✈️' },
    { min: 66,  max: 75,  name: 'مقدم',     icon: '🏅' },
    { min: 76,  max: 90,  name: 'عقيد',     icon: '🏅' },
    { min: 91,  max: 110, name: 'عميد',     icon: '🌟' },
    { min: 111, max: 130, name: 'لواء',     icon: '🌟' },
    { min: 131, max: 160, name: 'فريق',     icon: '⚜️' },
    { min: 161, max: 200, name: 'فريق أول', icon: '⚜️' },
    { min: 201, max: Infinity, name: 'مشير', icon: '👑' },
];

export const getRank = (level) => {
    return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[0];
};

export const getLevel = (xp) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const getXpForLevel = (level) => {
    return Math.pow(level - 1, 2) * 100;
};

export const getXpProgress = (xp) => {
    const level = getLevel(xp);
    const currentLevelXp = getXpForLevel(level);
    const nextLevelXp    = getXpForLevel(level + 1);
    const progress = xp - currentLevelXp;
    const needed   = nextLevelXp - currentLevelXp;
    const percent  = Math.floor((progress / needed) * 100);
    const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
    return { level, rank: getRank(level), bar, percent, progress, needed };
};
