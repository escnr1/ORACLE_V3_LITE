const handler = async (m, { conn, bot }) => {
    const targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!targetLid) return m.reply('⚠️ *منشن الشخص أو رد على رسالته*');

    let user;
    try {
        const meta = await conn.groupMetadata(m.chat);
        user = meta.participants.find(p => p.id === targetLid);
    } catch {
        return m.reply('*❌ لازم تستخدم الأمر في جروب*');
    }

    if (!user) return m.reply('*❌ مش قادر أجيب بيانات الشخص*');

    const rawPhone = user.phoneNumber;
    const jid = (typeof rawPhone === 'string' && rawPhone.includes('@s.whatsapp.net'))
        ? rawPhone
        : String(rawPhone || user.id || '').replace(/@.*/, '') + '@s.whatsapp.net';

    const lid   = String(user.id || targetLid);
    const phone = jid.replace('@s.whatsapp.net', '').split(':')[0];

    if (!phone || phone === 'undefined') return m.reply('*❌ مش قادر أجيب رقم الشخص*');

    const alreadyOwner = bot.config.owners.some(o =>
        (o.jid && o.jid === jid) || (o.lid && o.lid === lid)
    );
    if (alreadyOwner) return m.reply('*⚠️ الشخص ده مطور بالفعل*');

    const newOwner = { name: 'Dev', jid, lid, secondary: true };
    bot.config.owners.push(newOwner);

    // احفظ في database عشان يبقى بعد الريستارت
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.extraOwners) global.db.data.extraOwners = [];
    // شيل لو موجود قبل
    global.db.data.extraOwners = global.db.data.extraOwners.filter(
        o => o.jid !== jid && o.lid !== lid
    );
    global.db.data.extraOwners.push(newOwner);

    // حفظ مباشر
    try {
        const { writeFileSync } = await import('fs');
        const { readFileSync, existsSync } = await import('fs');
        const dbPath = './system/database.json';
        let dbData = {};
        if (existsSync(dbPath)) {
            try { dbData = JSON.parse(readFileSync(dbPath, 'utf-8')); } catch {}
        }
        if (!dbData.extraOwners) dbData.extraOwners = [];
        dbData.extraOwners = dbData.extraOwners.filter(o => o.jid !== jid && o.lid !== lid);
        dbData.extraOwners.push(newOwner);
        writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    } catch {}

    await conn.sendMessage(m.chat, {
        text:
            `*✅ المطور الثانوي الجديد اتضاف*\n\n` +
            `👤 @${phone}\n\n` +
            `*📋 الصلاحيات:*\n` +
            `├ 🔄 *.رستارت*\n` +
            `├ 🧹 *.تنظيف*\n` +
            `└ 🗑️ *.تنظيف_شامل*\n\n` +
            `> _اتحفظ - هيفضل بعد الريستارت ✅_`,
        mentions: [lid]
    }, { quoted: m });

    try {
        await conn.sendMessage(jid, {
            text:
                `*🎉 اتعينت مطور ثانوي في ORACLE*\n\n` +
                `> استخدم الأوامر بمسؤولية ⚡`
        });
    } catch {}
};

handler.usage    = ['ضيف_ديف'];
handler.category = 'owner';
handler.command  = ['ضيف_ديف', 'اضافه_ديف', 'add_dev'];
handler.owner    = true;
export default handler;
