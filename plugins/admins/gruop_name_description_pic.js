const handler = async (m, { conn, text, command }) => {
    if (!m.isGroup) return m.reply('❌ الأمر ده للجروبات بس');

    const actions = {
        'جروب_اسم': async () => {
            if (!text) return m.reply('✏️ ~ اكتب الاسم الجديد');
            await conn.groupUpdateSubject(m.chat, text);
            m.reply('✅ ~ اسم الجروب اتغير');
        },

        'جروب_وصف': async () => {
            if (!text) return m.reply('📝 ~ اكتب الوصف الجديد');
            await conn.groupUpdateDescription(m.chat, text);
            m.reply('✅ ~ وصف الجروب اتغير');
        },

        'جروب_صوره': async () => {
            const q = m.quoted || m;
            const mime = q.mimetype || '';

            if (!/image/.test(mime)) {
                return m.reply('🖼️ ~ رد على صورة');
            }

            const media = await q.download();
            await conn.updateProfilePicture(m.chat, media);
            m.reply('✅ ~ صورة الجروب اتغيرت');
        }
    };

    const action = actions[command];
    if (!action) return;

    try {
        await action();
    } catch (e) {
        console.error(e);
        m.reply(e.message);
    }
};

handler.command = ['جروب_اسم', 'جروب_وصف', 'جروب_صوره'];
handler.usage = ['جروب_اسم', 'جروب_وصف', 'جروب_صوره'];
handler.category = "admins";
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;