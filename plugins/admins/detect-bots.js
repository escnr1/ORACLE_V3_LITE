const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ الأمر ده بيشتغل في الجروبات بس*');
    if (!m.isOwner) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');

    await m.reply('*🔍 استنى بس، بفحص الجروب...*');

    try {
        const groupMeta = await conn.groupMetadata(m.chat);
        const participants = groupMeta.participants;

        // جيب البوتات الفرعية المعروفة
        const subList = global.subBots?.list?.() || [];
        const subPhones = subList.filter(b => b.phone).map(b => b.phone);

        // رقم البوت الرئيسي
        const botJid = conn.user?.id?.split(':')[0] + '@s.whatsapp.net';
        const owners = bot.config?.owners || [];

        const isProtected = (jid) => {
            if (!jid) return true;
            // البوت الرئيسي
            if (jid.includes(conn.user?.id?.split(':')[0])) return true;
            // المطورين
            if (owners.some(o => jid === o.jid || jid === o.lid)) return true;
            // البوتات الفرعية المعروفة
            const num = jid.split('@')[0].split(':')[0];
            if (subPhones.some(p => p === num)) return true;
            return false;
        };

        // كشف البوت الحقيقي:
        // JID فيه : يعني device متعدد = بوت مثبت على حساب عادي
        // مثال: 201234567890:12@s.whatsapp.net = بوت
        // مثال: 201234567890@s.whatsapp.net = إنسان عادي
        const suspectedBots = participants.filter(p => {
            if (isProtected(p.id)) return false;
            // لو الـ JID فيه : قبل @ → بوت
            const rawId = p.id || '';
            return rawId.includes(':') && rawId.includes('@s.whatsapp.net');
        });

        const subBotsCount = participants.filter(p => {
            const num = p.id?.split('@')[0]?.split(':')[0];
            return subPhones.includes(num);
        }).length;

        if (!suspectedBots.length) {
            return conn.sendMessage(m.chat, {
                text:
                    `*✅ مفيش بوتات غريبة في الجروب*\n\n` +
                    `👥 عدد الأعضاء: ${participants.length}\n` +
                    `🤖 بوتات فرعية معروفة: ${subBotsCount}`,
                mentions: []
            });
        }

        const list = suspectedBots.map((p, i) =>
            `${i + 1}. @${p.id.split('@')[0].split(':')[0]}${p.admin ? ' 👑 ادمن' : ''}`
        ).join('\n');

        await conn.sendMessage(m.chat, {
            text:
                `*🤖 نتيجة الفحص*\n\n` +
                `👥 عدد الأعضاء: ${participants.length}\n` +
                `✅ بوتات فرعية معروفة: ${subBotsCount}\n` +
                `🚨 بوتات غريبة: ${suspectedBots.length}\n\n` +
                `*القائمة:*\n${list}\n\n` +
                `> اكتب *.طرد_البوتات* لو عايز تطردهم`,
            mentions: suspectedBots.map(p => p.id)
        });

        if (!global.detectedBots) global.detectedBots = {};
        global.detectedBots[m.chat] = suspectedBots.map(p => p.id);

    } catch (e) {
        console.error('[DetectBots]', e.message);
        m.reply(`*❌ حصل خطأ يا معلم:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage    = ['كشف_البوتات'];
handler.category = 'settings';
handler.command  = ['كشف_البوتات'];
handler.owner    = true;
export default handler;
