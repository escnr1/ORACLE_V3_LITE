const handler = async (m, { conn, command }) => {
    if (command === 'مغلق') {
        global.devStatus = 'closed';
        return m.reply('*🔴 وضع المغلق اتشغل*\n> أمر .المطور هيرد بـ "مش فاضي"');
    }
    if (command === 'مفتوح') {
        global.devStatus = 'open';
        return m.reply('*🟢 وضع المفتوح اتشغل*\n> أمر .المطور هيرد عادي');
    }
};

handler.usage = ['مغلق', 'مفتوح'];
handler.category = 'owner';
handler.command = ['مغلق', 'مفتوح'];
handler.owner = true;
export default handler;
