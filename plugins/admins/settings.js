// helper - يجيب إعدادات الجروب من store آمن
const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

async function handler(m, { conn, command, args }) {
    const chatId = m.chat;
    const subCmd = args[0]?.toLowerCase()?.trim();

    if (!subCmd) {
        return conn.sendButton(m.chat, {
            imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
            bodyText: '*⚙️ نظام التفعيل والتشغيل*\n\nاختار من القايمة أو اكتب الأمر على طول',
            footerText: '𝐎𝐑𝐀𝐂𝐋𝐄 BOT',
            buttons: [
                {
                    name: 'single_select',
                    params: {
                        title: '📋 اختار الإعداد',
                        sections: [
                            {
                                title: '🎉 الترحيب',
                                rows: [
                                    { title: '✅ تشغيل الترحيب', id: '.تفعيل تشغيل_الترحيب' },
                                    { title: '❌ ايقاف الترحيب', id: '.تفعيل ايقاف_الترحيب' },
                                ]
                            },
                            {
                                title: '🛡️ الحماية',
                                rows: [
                                    { title: '✅ تشغيل مضاد الروابط', id: '.تفعيل تشغيل_مضاد_الروابط' },
                                    { title: '❌ ايقاف مضاد الروابط', id: '.تفعيل ايقاف_مضاد_الروابط' },
                                    { title: '✅ تشغيل ضد الشاتم', id: '.تفعيل تشغيل_ضد_الشاتم' },
                                    { title: '❌ ايقاف ضد الشاتم', id: '.تفعيل ايقاف_ضد_الشاتم' },
                                    { title: '✅ تشغيل مضاد البوتات', id: '.تفعيل تشغيل_مضاد_البوتات' },
                                    { title: '❌ ايقاف مضاد البوتات', id: '.تفعيل ايقاف_مضاد_البوتات' },
                                ]
                            },
                            {
                                title: '🚫 مضادات الميديا',
                                rows: [
                                    { title: '✅ تشغيل مضاد الستيكر', id: '.تفعيل تشغيل_مضاد_الستيكر' },
                                    { title: '❌ ايقاف مضاد الستيكر', id: '.تفعيل ايقاف_مضاد_الستيكر' },
                                    { title: '✅ تشغيل مضاد الفيديو', id: '.تفعيل تشغيل_مضاد_الفيديو' },
                                    { title: '❌ ايقاف مضاد الفيديو', id: '.تفعيل ايقاف_مضاد_الفيديو' },
                                    { title: '✅ تشغيل مضاد الصور', id: '.تفعيل تشغيل_مضاد_الصور' },
                                    { title: '❌ ايقاف مضاد الصور', id: '.تفعيل ايقاف_مضاد_الصور' },
                                    { title: '✅ تشغيل مضاد الصوت', id: '.تفعيل تشغيل_مضاد_الصوت' },
                                    { title: '❌ ايقاف مضاد الصوت', id: '.تفعيل ايقاف_مضاد_الصوت' },
                                ]
                            },
                            {
                                title: '👑 الصلاحيات',
                                rows: [
                                    { title: '✅ تشغيل الادمن فقط', id: '.تفعيل تشغيل_الادمن' },
                                    { title: '❌ ايقاف الادمن فقط', id: '.تفعيل ايقاف_الادمن' },
                                    { title: '🔒 مطور فقط', id: '.تفعيل مطور_فقط' },
                                    { title: '🔓 مطور عام', id: '.تفعيل مطور_عام' },
                                    { title: '🔒 ايقاف الخاص', id: '.تفعيل ايقاف_خاص' },
                                    { title: '🔓 تشغيل الخاص', id: '.تفعيل تشغيل_خاص' },
                                ]
                            },
                            {
                                title: '⚙️ البوتات الفرعية',
                                rows: [
                                    { title: '❌ ايقاف الفرعي', id: '.تفعيل ايقاف_الفرعي' },
                                    { title: '✅ تشغيل الفرعي', id: '.تفعيل تشغيل_الفرعي' },
                                ]
                            }
                        ]
                    }
                }
            ],
            mentions: [m.sender],
            interactiveConfig: { buttons_limits: 1, list_title: 'القايمة', button_title: 'اختار من هنا', canonical_url: 'https://whatsapp.com' }
        }, m);
    }

    const checkPerm = (adminOnly = true) => {
        if (adminOnly && !m.isOwner && !m.isAdmin) return '*「🔥」 الامـࢪ دا بـتـا؏ الادمــن بــس يــسـطــا*';
        if (!adminOnly && !m.isOwner) return '*「🔥」الامـࢪ دا بـتـا؏ أوراكل  مـطـوࢪي.*';
        return null;
    };

    // كل الإعدادات دي لازم تتخزن في global.db (مش global._gs المؤقت)
    // عشان ده المكان اللي كود الإنفاذ الفعلي (plugins/auto/atuo.js وplugins/subs/sub.js) بيقرا منه
    if (!global.db.groups) global.db.groups = {};
    if (!global.db.groups[chatId]) global.db.groups[chatId] = {};
    const gGroup = global.db.groups[chatId];

    const setGroupFlag = (key, val, onMsg, offMsg, adminOnly = true) => {
        const err = checkPerm(adminOnly);
        if (err) return err;
        if (val) { gGroup[key] = true; } else { delete gGroup[key]; }
        return val ? onMsg : offMsg;
    };

    // مضادات الميديا/الروابط لسه بتستخدم getG() (global._gs) عشان كده
    // متسقة مع باقي أوامر الحماية (.مضاد_روابط، .مضاد_سب، إلخ)
    const g = getG(chatId);

    const setG = (key, val, onMsg, offMsg, adminOnly = true) => {
        const err = checkPerm(adminOnly);
        if (err) return err;
        if (val) {
            g[key] = true;
        } else {
            delete g[key];
        }
        return val ? onMsg : offMsg;
    };

    const CASES = {
        'تشغيل_الترحيب':       () => setG('welcomeDisabled', false,  '*✅ الترحيب اتشغل* 🎉', ''),
        'ايقاف_الترحيب':       () => setG('welcomeDisabled', true, '', '*✅ الترحيب اتقفل*'),
        'تشغيل_مضاد_الروابط': () => setG('antiLink', true,  '*✅ مضاد الروابط اتشغل* 🔗', ''),
        'ايقاف_مضاد_الروابط': () => setG('antiLink', false, '', '*✅ مضاد الروابط اتقفل*'),
        'تشغيل_ضد_الشاتم':    () => setG('antiCurse', true,  '*✅ ضد الشاتم اتشغل* 🚫', ''),
        'ايقاف_ضد_الشاتم':    () => setG('antiCurse', false, '', '*✅ ضد الشاتم اتقفل*'),
        'تشغيل_مضاد_البوتات': () => setG('antiBots', true,  '*✅ مضاد البوتات اتشغل* 🤖', ''),
        'ايقاف_مضاد_البوتات': () => setG('antiBots', false, '', '*✅ مضاد البوتات اتقفل*'),
        'تشغيل_مضاد_الستيكر': () => setG('antiSticker', true,  '*✅ مضاد الستيكر اتشغل* 🎭', ''),
        'ايقاف_مضاد_الستيكر': () => setG('antiSticker', false, '', '*✅ مضاد الستيكر اتقفل*'),
        'تشغيل_مضاد_الفيديو': () => setG('antiVideo', true,  '*✅ مضاد الفيديو اتشغل* 🎬', ''),
        'ايقاف_مضاد_الفيديو': () => setG('antiVideo', false, '', '*✅ مضاد الفيديو اتقفل*'),
        'تشغيل_مضاد_الصور':   () => setG('antiImage', true,  '*✅ مضاد الصور اتشغل* 🖼️', ''),
        'ايقاف_مضاد_الصور':   () => setG('antiImage', false, '', '*✅ مضاد الصور اتقفل*'),
        'تشغيل_مضاد_الصوت':   () => setG('antiAudio', true,  '*✅ مضاد الصوت اتشغل* 🔉', ''),
        'ايقاف_مضاد_الصوت':   () => setG('antiAudio', false, '', '*✅ مضاد الصوت اتقفل*'),

        // الأربعة دول كانوا بيكتبوا في مكان غلط - اتصلحوا يكتبوا في global.db
        'تشغيل_الادمن': () => setGroupFlag('adminOnly', true,  '*✅ وضع الادمن اتفعّل* 👑', ''),
        'ايقاف_الادمن': () => setGroupFlag('adminOnly', false, '', '*✅ وضع الادمن اتفك*'),
        'مطور_فقط': () => { const e = checkPerm(false); if (e) return e; global.db.ownerOnly = true; return '*✅ وضع المطور بس اتفعّل*'; },
        'مطور_عام':  () => { const e = checkPerm(false); if (e) return e; global.db.ownerOnly = false; return '*✅ وضع المطور العام اتفعّل*'; },
        'ايقاف_خاص': () => { const e = checkPerm(false); if (e) return e; global.db.dev = true; return '*✅ البوت اتقفل في الخاص للعامة*'; },
        'تشغيل_خاص': () => { const e = checkPerm(false); if (e) return e; global.db.dev = false; return '*✅ البوت اتفتح في الخاص للكل*'; },
        'ايقاف_الفرعي': () => { const e = checkPerm(false); if (e) return e; global.db.noSub = true; return '*✅ البوتات الفرعية اتقفلت*'; },
        'تشغيل_الفرعي': () => { const e = checkPerm(false); if (e) return e; global.db.noSub = false; return '*✅ البوتات الفرعية اتشغلت*'; },
    };

    const fn = CASES[subCmd];
    if (!fn) return m.reply('*❌ الأمر ده مش معروف، اكتب .تفعيل عشان تشوف القايمة*');
    const result = fn();
    if (result) await m.reply(result);
}

handler.usage = ['تفعيل'];
handler.category = 'admins';
handler.command = ['تفعيل'];
export default handler;
