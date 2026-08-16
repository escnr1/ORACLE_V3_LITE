const NEWSLETTER = { name: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦', jid: '120363422581600030@newsletter' };

const DEFAULT_TAGS = ['🔥 الأقوى', '⚡ ترند', '👑 مميز', '💎 مايتفوتش', '🚀 جديد', '✨ الأحلى', '🎯 جربه', '🏆 الأفضل'];
const tagFor = (i) => DEFAULT_TAGS[i % DEFAULT_TAGS.length];

async function safeText(conn, m, text) {
    try {
        return await conn.sendMessage(m.chat, { text }, { quoted: m });
    } catch (e) {
        console.error('[menu_builder] حتى الرسالة النصية فشلت:', e?.message);
        return null;
    }
}

async function sendMainMenu(m, { conn, bot }, { sections, user, totalUsers } = {}) {
  try {
    const mentionId = m.sender;
    const now = new Date();
    const week = now.toLocaleDateString('ar-EG', { weekday: 'long' });
    const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@${mentionId.split('@')[0]}⌉
── • ◈ • ──
*⌝👿┊𝙾𝚁𝙰𝙲𝙻𝙴-𝙱𝙾𝚃┊👿⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ☠️˖ ⟨الاسم: 𝙾𝚁𝙰𝙲𝙻𝙴-𝙱𝙾𝚃☇
> │┊ ۬.͜ـ👑˖ ⟨المطورين: 𝐓𝐇𝐄 𝐅𝐎𝐔𝐑 𝐋𝐎𝐑𝐃𝐒☇
> │┊ ۬.͜ـ⌛˖ ⟨اليوم: ${week}☇
> │┊ ۬.͜ـ⏳˖ ⟨التاريخ: ${date}☇
> │┊ ۬.͜ـ🔱˖ ⟨مستواك: ${user?.level ?? '-'}☇
> │┊ ۬.͜ـ👨🏻‍✈️˖ ⟨رتبتك: ${user?.role ?? '-'}☇
> │┊ ۬.͜ـ👥˖ ⟨المستخدمين: ${totalUsers ?? '-'}☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─⊰ـ`;

    const categorySections = (sections || []).map((s, i) => ({
        title: `❪${s.title}❫`,
        highlight_label: s.highlight || tagFor(i),
        rows: [{
            title: s.title,
            description: s.header || 'اضغط لعرض الأوامر',
            id: s.id
        }]
    }));

    const linksRows = [
        { title: '💬 شات البوت', description: 'تواصل مباشر مع المطور', id: '.شات_البوت' },
        { title: '⭐ تقييم البوت', description: 'قيّم البوت وساعدنا نتحسن', id: '.تقيم' },
        { title: '🔗 روابط وتواصل', description: 'الجروب + القناة + كل الروابط', id: '.الروابط' },
        { title: '🛠️ تنصيب', description: 'نصّب البوت في جروبك', id: '.تنصيب' },
        { title: '👑 المطور', description: 'تواصل مع المطور', id: '.المطور' }
    ];

    try {
        return await conn.sendButton(m.chat, {
            bodyText,
            footerText: bot?.config?.info?.nameBot || '𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓',
            buttons: [
                {
                    name: 'single_select',
                    params: {
                        title: 'الأقسام الرئيسية 📁',
                        sections: categorySections
                    }
                },
                {
                    name: 'single_select',
                    params: {
                        title: 'تنصيب 🤖',
                        sections: [{
                            title: 'خدمات التنصيب',
                            rows: [
                                { title: '🛠️ تنصيب البوت', description: 'نصّب البوت في جروبك', id: '.تنصيب' },
                                { title: '🔗 روابط وتواصل', description: 'الجروب + القناة', id: '.الروابط' }
                            ]
                        }]
                    }
                },
                {
                    name: 'single_select',
                    params: {
                        title: 'جروب الدعم ⚙️',
                        sections: [{
                            title: 'روابط وخدمات',
                            rows: linksRows
                        }]
                    }
                }
            ],
            mentions: [m.sender],
            interactiveConfig: { buttons_limits: 3 }
        }, m);
    } catch (e2) {
        console.error('[sendMainMenu] فشل إرسال الأزرار:', e2?.message);
        return safeText(conn, m, bodyText);
    }
  } catch (e) {
    console.error('[sendMainMenu] خطأ غير متوقع:', e?.message);
    return safeText(conn, m, '*❌ حصل خطأ في عرض القائمة، جرب تاني.*');
  }
}

async function sendSectionMenu(m, { conn, bot }, { sectionId, sectionTitle, sectionEmoji, rows, backCommand = 'قائمة' } = {}) {
  try {
    const cmdsText = (rows || []).map(r => `> │┊ ۬.͜ـ${sectionEmoji}˖ ⟨${r.cmd} | ${r.desc}☇`).join('\n');
    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@${m.sender.split('@')[0]}⌉
── • ◈ • ──
*⌝${sectionEmoji}┊قـائـمـة ${sectionTitle}┊${sectionEmoji}⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
${cmdsText}
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`;
    try {
        return await conn.sendButton(m.chat, {
            bodyText,
            footerText: bot?.config?.info?.nameBot || '𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓',
            buttons: [
                {
                    name: 'single_select',
                    params: {
                        title: `${sectionEmoji} الأوامر`,
                        sections: [{
                            title: `${sectionTitle}`,
                            rows: (rows || []).map(r => ({
                                title: `${r.cmd}`,
                                description: r.desc || sectionTitle,
                                id: `.${r.cmd}`
                            }))
                        }]
                    }
                },
                { name: 'quick_reply', params: { display_text: '🔙 الرئيسية', id: `.${backCommand}` } }
            ],
            mentions: [m.sender],
            interactiveConfig: { buttons_limits: 2 }
        }, m);
    } catch (e) {
        return safeText(conn, m, bodyText);
    }
  } catch (e) {
    return safeText(conn, m, '*❌ حصل خطأ في عرض القائمة، جرب تاني.*');
  }
}

async function sendDevMenu(m, { conn, bot }, isDev, backCommand = 'قائمة') {
    if (!isDev) return null;
  try {
    const cmds = [
        { cmd: 'بنج', desc: 'اختبار سرعة البوت' },
        { cmd: 'الرام', desc: 'إظهار استخدام الذاكرة' },
        { cmd: 'الايرورات', desc: 'عرض آخر الأخطاء' },
        { cmd: 'اضافه_ملف', desc: 'إضافة ملف أمر جديد' },
        { cmd: 'اضافه_قسم', desc: 'إضافة قسم جديد' },
        { cmd: 'اضافه_مطور', desc: 'إضافة مطور جديد' },
        { cmd: 'حظر', desc: 'حظر مستخدم' },
        { cmd: 'فك_حظر', desc: 'فك حظر مستخدم' },
        { cmd: 'بلوك', desc: 'بلوك رقم مايقدرش ينصب ولا يستخدم البوت' },
        { cmd: 'فك_بلوك', desc: 'فك البلوك عن رقم' },
        { cmd: 'البوتات', desc: 'إدارة البوتات الفرعية' },
        { cmd: 'اذاعه_فرعي', desc: 'إذاعة لجميع المجموعات' },
        { cmd: 'تنظيف', desc: 'حذف الملفات المؤقتة' },
        { cmd: 'لمطور', desc: 'معرّف المستخدم' }
    ];
    const cmdsText = cmds.map(c => `> │┊ ۬.͜ـ👨🏻‍💻˖ ⟨${c.cmd} | ${c.desc}☇`).join('\n');
    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@${m.sender.split('@')[0]}⌉
── • ◈ • ──
*⌝👨🏻‍💻┊قـائـمـة المطورين┊👨🏻‍💻⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
${cmdsText}
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`;
    try {
        return await conn.sendButton(m.chat, {
            bodyText,
            footerText: bot?.config?.info?.nameBot || '𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓',
            buttons: [
                {
                    name: 'single_select',
                    params: {
                        title: 'أوامر المطورين 👨🏻‍💻',
                        sections: [{
                            title: 'قسم المطورين',
                            rows: cmds.map(c => ({
                                title: `${c.cmd}`,
                                description: c.desc,
                                id: `.${c.cmd}`
                            }))
                        }]
                    }
                },
                { name: 'quick_reply', params: { display_text: '🔙 الرئيسية', id: `.${backCommand}` } }
            ],
            mentions: [m.sender],
            interactiveConfig: { buttons_limits: 2 }
        }, m);
    } catch (e) {
        return safeText(conn, m, bodyText);
    }
  } catch (e) {
    return safeText(conn, m, '*❌ حصل خطأ في عرض القائمة، جرب تاني.*');
  }
}

export { sendMainMenu, sendSectionMenu, sendDevMenu };
