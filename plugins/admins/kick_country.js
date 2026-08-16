// طرد-دوله - طرد أعضاء من دولة معينة
const COUNTRY_CODES = {
    'مصر': ['20'], 'السعودية': ['966'], 'الإمارات': ['971'],
    'الكويت': ['965'], 'قطر': ['974'], 'البحرين': ['973'],
    'عمان': ['968'], 'الأردن': ['962'], 'العراق': ['964'],
    'سوريا': ['963'], 'لبنان': ['961'], 'اليمن': ['967'],
    'المغرب': ['212'], 'الجزائر': ['213'], 'تونس': ['216'],
    'ليبيا': ['218'], 'السودان': ['249'], 'الصومال': ['252'],
    'نيجيريا': ['234'], 'روسيا': ['7'], 'ألمانيا': ['49'],
    'فرنسا': ['33'], 'أمريكا': ['1'], 'تركيا': ['90'],
    'إيران': ['98'], 'باكستان': ['92'], 'الهند': ['91'],
};

const handler = async (m, { conn, text }) => {
    if (!text) {
        const list = Object.keys(COUNTRY_CODES).join(' | ');
        return m.reply(`*مثال:* .طرد-دوله نيجيريا\n\n*الدول الموجودة:*\n${list}`);
    }

    const country = text.trim();
    const codes = COUNTRY_CODES[country];
    if (!codes) return m.reply(`*❌ الدولة دي مش معروفة:* ${country}\n\nاكتب *.طرد-دوله* عشان تشوف القايمة`);

    try {
        const meta = await conn.groupMetadata(m.chat);
        const toKick = meta.participants.filter(p => {
            const num = p.id.split('@')[0].split(':')[0];
            return codes.some(code => num.startsWith(code)) && !p.admin;
        });

        if (!toKick.length) return m.reply(`*✅ مفيش أعضاء من ${country}*`);

        await m.reply(`*⏳ استنى بس، بطرد ${toKick.length} عضو من ${country}...*`);

        let kicked = 0;
        for (const p of toKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [p.id], 'remove');
                kicked++;
                await new Promise(r => setTimeout(r, 500));
            } catch {}
        }

        await conn.sendMessage(m.chat, {
            text: `✅ *اتطرد ${kicked} عضو من ${country}*`
        });
    } catch (e) {
        m.reply(`*❌ خطأ:* ${e.message?.slice(0, 100)}`);
    }
};
handler.command  = ['طرد-دوله', 'طرد_دوله'];
handler.usage    = ['طرد-دوله'];
handler.admin    = true;
handler.botAdmin = true;
handler.category = 'admins';
export default handler;
