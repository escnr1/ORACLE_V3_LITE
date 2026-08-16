// .عام_فرعي - يرجع البوت الفرعي للوضع العام (يرد على الكل زي العادي)
// عكس .خاص_فرعي بالظبط. نفس شرط صاحب الجلسة، ونفس عزل الجلسات per bot.id.
// الإنفاذ الفعلي موجود في: oracle/system/control.js -> access()

const run = async (m, { conn, bot }) => {
    if (!bot?.isSubBot) {
        return m.reply('*⚠️ الأمر ده للبوتات الفرعية بس*');
    }

    const ownNum    = (conn?.user?.id || '').split(':')[0].split('@')[0];
    const senderNum = (m.sender || '').split('@')[0].split(':')[0];

    if (!ownNum || !senderNum || ownNum !== senderNum) {
        return m.reply('*⚠️ الأمر ده لصاحب الجلسة بس (صاحب رقم البوت الفرعي)*');
    }

    if (global.__subPrivacy && global.__subPrivacy[bot.id]) {
        delete global.__subPrivacy[bot.id];
    }

    return m.reply(
        `🌐 *تم تفعيل الوضع العام*\n\n` +
        `دلوقتي البوت هيرد على أي حد يكتبله زي العادي.`
    );
};

run.command  = ['عام_فرعي'];
run.usage    = ['عام_فرعي'];
run.category = 'sub';
run.noSub    = false;

export default run;
