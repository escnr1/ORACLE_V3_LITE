// ════════════════════════════════════════
//  ourin-welcome-card.js — Compatibility shim
//  بطاقة ترحيب/وداع بأسلوب ديسكورد الواسع، باستخدام skia-canvas
//  المتاحة أصلاً في المشروع.
// ════════════════════════════════════════
import { Canvas, loadImage } from 'skia-canvas';
import axios from 'axios';

export async function createWideDiscordCard(options = {}) {
    const {
        avatarUrl,
        title = 'أهلاً بيك!',
        subtitle = '',
        backgroundColor = '#23272a',
        accentColor = '#8ACE00'
    } = options;

    const canvas = new Canvas(1000, 300);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 1000, 300);

    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, 12, 300);

    try {
        if (avatarUrl) {
            const res = await axios.get(avatarUrl, { responseType: 'arraybuffer', timeout: 15000 });
            const avatar = await loadImage(Buffer.from(res.data));
            ctx.save();
            ctx.beginPath();
            ctx.arc(150, 150, 90, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(avatar, 60, 60, 180, 180);
            ctx.restore();
        }
    } catch {}

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, 300, 150);

    if (subtitle) {
        ctx.fillStyle = '#b9bbbe';
        ctx.font = '28px sans-serif';
        ctx.fillText(subtitle, 300, 200);
    }

    return canvas.toBuffer('png');
}

// بطاقة وداع بنفس ستايل بطاقة الترحيب، بس بألوان مختلفة وتوقيع أسماء
// المتغيرات اللي بيستخدمها plugins/vonr/group/goodbye.js (اسم، صورة، اسم
// الجروب، عدد الأعضاء) بدل أوبجكت options.
export async function createGoodbyeCard(userName, avatarUrl, groupName, memberCount) {
    return createWideDiscordCard({
        avatarUrl,
        title: `مع السلامة يا ${userName}`,
        subtitle: `${groupName} • العدد دلوقتي: ${memberCount}`,
        backgroundColor: '#2c2f33',
        accentColor: '#ed4245'
    });
}

export default { createWideDiscordCard, createGoodbyeCard };
