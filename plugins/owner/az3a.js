// ❌ تم تعطيل أمر الإذاعة الجماعية
// السبب: يخالف شروط واتساب - bulk messaging مش مسموح
// (WhatsApp ToS: "involve sending...bulk messaging, auto-messaging")

const run = async (m, { conn }) => {
    return m.reply(
        `*❌ أمر الإذاعة الجماعية مقفول*\n\n` +
        `> السبب: يخالف شروط خدمة واتساب\n` +
        `> _WhatsApp Terms of Service - Acceptable Use_`
    );
};

run.command  = ['اذاعه'];
run.usage    = ['اذاعه'];
run.category = 'owner';
run.owner    = true;
export default run;
