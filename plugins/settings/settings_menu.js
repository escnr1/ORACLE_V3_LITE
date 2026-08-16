// ════════════════════════════════════════
//  قسم الإعدادات - للمطورين فقط 👑
// ════════════════════════════════════════

const handler = async (m, { conn, bot, command, args }) => {
    if (!m.isOwner) return m.reply('*❌ قسم الإعدادات للمطورين بس*');

    const sub = args[0]?.toLowerCase()?.trim();

    // ══ القائمة الرئيسية ══
    if (!sub) {
        try {
            return conn.sendButton(m.chat, {
                imageUrl: 'https://i.postimg.cc/xd6xmf0p/9e0c32d018f9bea5a756fffa76e95b3a.jpg',
                bodyText:
                    `*⚙️ لوحة الإعدادات*\n\n` +
                    `أهلاً بيكً ${m.pushName || 'مطور'} 👑\n` +
                    `اختار من القايمة أو اكتب الأمر على طول`,
                footerText: '𝑶𝑹𝑨𝑪𝑳𝑬 BOT | إعدادات المطورين',
                buttons: [
                    {
                        name: 'single_select',
                        params: {
                            title: '⚙️ اختار الإعداد',
                            sections: [
                                {
                                    title: '🔧 الأوامر والأقسام',
                                    rows: [
                                        { title: '🚫 إيقاف أمر',   description: 'بيوقف أمر معين', id: `.اعدادات ايقاف_امر` },
                                        { title: '✅ تشغيل أمر',   description: 'بيشغّل أمر متوقف', id: `.اعدادات تشغيل_امر` },
                                        { title: '🚫 إيقاف قسم',   description: 'بيوقف قسم كامل', id: `.اعدادات ايقاف_قسم` },
                                        { title: '✅ تشغيل قسم',   description: 'بيشغّل قسم متوقف', id: `.اعدادات تشغيل_قسم` },
                                        { title: '📋 عرض الموقف',  description: 'شوف الأوامر المتوقفة', id: `.الموقف` },
                                    ]
                                },
                                {
                                    title: '🤖 البوتات',
                                    rows: [
                                        { title: '🚫 ضد البوتات on',  description: 'طرد على طول للبوتات', id: `.ضد_البوتات on` },
                                        { title: '⚠️ ضد البوتات off', description: 'إنذار 3 مرات وبعدين طرد', id: `.ضد_البوتات off` },
                                        { title: '🔍 كشف البوتات',     description: 'بيكشف البوتات في الجروب', id: `.كشف_البوتات` },
                                    ]
                                },
                                {
                                    title: '⚙️ إعدادات عامة',
                                    rows: [
                                        { title: '🔤 تغيير البريفكس', description: 'بيغيّر الرمز اللي بيبدأ بيه الأمر', id: `.بريفكس` },
                                        { title: '📊 عرض الأقسام',    description: 'كل الأقسام الموجودة', id: `.الاقسام` },
                                    ]
                                },
                            ]
                        }
                    }
                ],
                mentions: [m.sender],
                interactiveConfig: { buttons_limits: 1 }
            }, m);
        } catch {
            return m.reply(
                `*⚙️ لوحة الإعدادات*\n\n` +
                `*🔧 الأوامر والأقسام:*\n` +
                `• *.ايقاف_امر <اسم>*\n• *.تشغيل_امر <اسم>*\n• *.ايقاف_قسم <اسم>*\n• *.تشغيل_قسم <اسم>*\n• *.الموقف*\n\n` +
                `*🤖 البوتات:*\n` +
                `• *.ضد_البوتات on/off*\n• *.كشف_البوتات*\n\n` +
                `*⚙️ عام:*\n` +
                `• *.بريفكس <رمز>*\n• *.الاقسام*`
            );
        }
    }

    // ══ Sub-commands shortcuts ══
    const remaining = args.slice(1).join(' ');

    const SHORTCUTS = {
        'ايقاف_امر':   'ايقاف_امر',
        'تشغيل_امر':   'تشغيل_امر',
        'ايقاف_قسم':   'ايقاف_قسم',
        'تشغيل_قسم':   'تشغيل_قسم',
    };

    if (SHORTCUTS[sub]) {
        if (!remaining) return m.reply(`*📌 مثال:* \`.اعدادات ${sub} اسم_الأمر\``);
        return m.reply(`*📌 اكتب على طول:* \`.${SHORTCUTS[sub]} ${remaining}\``);
    }

    return m.reply(`*❌ أمر مش معروف:* ${sub}\n\n*.اعدادات* عشان تشوف القايمة`);
};

handler.usage    = ['اعدادات'];
handler.category = 'settings';
handler.command  = ['اعدادات', 'settings', 'الاعدادات'];
handler.owner    = true;

export default handler;
