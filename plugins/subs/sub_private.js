// .خاص_فرعي - وضع خاص للبوت الفرعي
// لما صاحب الجلسة (اللي منصب البوت برقمه) يكتب الأمر ده، البوت هيرد عليه
// هو بس مهما حد تاني كتب أي أمر. كل بوت فرعي له جلسته الخاصة (bot.id)
// فالتفعيل في بوت متأثرش على أي بوت فرعي تاني حتى لو نفس الكود بالظبط.
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

    if (!global.__subPrivacy) global.__subPrivacy = {};
    global.__subPrivacy[bot.id] = 'private';

    return m.reply(
        `🔒 *تم تفعيل الوضع الخاص*\n\n` +
        `دلوقتي البوت مش هيرد إلا عليك انت بس يا صاحب الجلسة، مهما حد تاني كتب أي أمر.\n\n` +
        `> عايز ترجع تاني للوضع العام؟ اكتب: *.عام_فرعي*`
    );
};

run.command  = ['خاص_فرعي'];
run.usage    = ['خاص_فرعي'];
run.category = 'sub';
run.noSub    = false;

export default run;
