// ourin-formatter.js — Compatibility shim
export function getTimeGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'صباح الخير';
    if (h >= 12 && h < 17) return 'مساء الخير';
    if (h >= 17 && h < 21) return 'مساء الفل';
    return 'تصبح على خير';
}

export function formatNumber(n = 0) {
    return Number(n).toLocaleString('ar-EG');
}

export function formatCurrency(n = 0) {
    return `${Number(n).toLocaleString('ar-EG')} جنيه`;
}

export default { getTimeGreeting, formatNumber, formatCurrency };
