import fetch from 'node-fetch';

async function ترجمة(نص, لغة = 'ar') {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.append('client', 'gtx');
    url.searchParams.append('sl', 'auto');
    url.searchParams.append('tl', لغة);
    url.searchParams.append('dt', 't');
    url.searchParams.append('q', نص);

    const res = await fetch(url.href);
    const json = await res.json();
    if (!json?.[0]) throw new Error('الاتصال بخدمة الترجمة مضربش');
    return json[0].map(item => item[0]).join('');
}

const handler = async (m, { conn, text, args, command }) => {
    // إذا ما في نص وما في رد
    if (!text && !m.quoted?.text) {
        return m.reply(
            `*🌐 أمر الترجمة*\n\n` +
            `*طريقة الاستخدام:*\n` +
            `• .${command} أهلاً بيك ← يترجم للإنجليزي تلقائياً\n` +
            `• .${command} ar Hello ← يترجم للعربي\n` +
            `• .${command} en أهلاً بيك ← يترجم للإنجليزي\n\n` +
            `*أكواد اللغات الشائعة:*\n` +
            `ar = عربي | en = إنجليزي | fr = فرنسي\n` +
            `es = إسباني | de = ألماني | tr = تركي`
        );
    }

    m.react('⏳');

    try {
        let لغة_مقصودة = 'en';
        let نص_للترجمة = '';

        // لو رد على رسالة
        if (m.quoted?.text && !text) {
            نص_للترجمة = m.quoted.text;
            لغة_مقصودة = 'ar';
        } else if (args.length >= 2 && args[0].length <= 5 && /^[a-z]{2,5}$/i.test(args[0])) {
            // أول كلمة كود لغة
            لغة_مقصودة = args[0].toLowerCase();
            نص_للترجمة = args.slice(1).join(' ');
        } else {
            // ترجم كل النص للعربي إذا كان إنجليزي، أو للإنجليزي إذا كان عربي
            نص_للترجمة = text;
            لغة_مقصودة = /[\u0600-\u06FF]/.test(نص_للترجمة) ? 'en' : 'ar';
        }

        // لو رد + لغة محددة
        if (m.quoted?.text && args[0] && args[0].length <= 5) {
            نص_للترجمة = m.quoted.text;
            لغة_مقصودة = args[0].toLowerCase();
        }

        const ناتج = await ترجمة(نص_للترجمة, لغة_مقصودة);

        await conn.sendMessage(m.chat, {
            text: `*🌐 الترجمة:*\n\n${ناتج}`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ الترجمة مضربت:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['ترجمة'];
handler.command = ['ترجمة', 'translate', 'tr'];
handler.category = 'tools';

export default handler;
