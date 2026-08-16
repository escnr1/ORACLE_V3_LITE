import { sendLinksList } from './menu_builder.js';

const LINKS = [
    { title: '💬 شات البوت', description: 'تواصل مباشر مع المطور', id: '.شات_البوت' },
    { title: '⭐ تقييم البوت', description: 'قيّم البوت وساعدنا نتحسن', id: '.تقيم' },
    { title: '🔗 روابط وتواصل', description: 'الجروب + القناة + كل الروابط', id: '.الروابط' },
    { title: '🛠️ تنصيب', description: 'نصّب البوت في جروبك', id: '.تنصيب' },
    { title: '👑 المطور', description: 'تواصل مع المطور', id: '.المطور' }
];

async function handler(m, { conn, bot }) {
    await sendLinksList(m, { conn, bot }, { rows: LINKS });
}

handler.command = ['روابط_البوت'];
handler.category = 'main';
export default handler;
