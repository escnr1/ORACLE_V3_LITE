// ourin-game-ulartangga.js — Compatibility shim: لعبة السلم والثعبان (ular tangga)
export const DICE_STICKERS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const MAPS = [
    { snakes: { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 },
      ladders: { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 } }
];

export function getRandomMap() {
    return MAPS[Math.floor(Math.random() * MAPS.length)];
}

export function drawBoard(position = 1) {
    // ⚠️ نسخة مبسطة نصية بدل رسم حقيقي للوحة (محتاج canvas حقيقي لو عايز صورة)
    return `🎲 موقعك الحالي على اللوحة: ${position}/100`;
}

export default { DICE_STICKERS, getRandomMap, drawBoard };
