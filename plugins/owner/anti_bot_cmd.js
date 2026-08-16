const handler = async (m, { command, text }) => {
    const detector = global._botDetector;
    if (!detector) return m.reply('*❌ مكتبة كشف البوتات مش شغالة*');

    const val = text?.trim()?.toLowerCase();

    if (val === 'on' || val === 'تشغيل') {
        detector.enableAntiBotMode();
        return m.reply('✅ *وضع الطرد الفوري للبوتات اتشغل*\n⚡ أي بوت = طرد على طول');
    }

    if (val === 'off' || val === 'ايقاف') {
        detector.disableAntiBotMode();
        return m.reply('✅ *وضع الطرد الفوري اتقفل*\n> هيتم الإنذار 3 مرات وبعدين طرد');
    }

    return m.reply(
        `*🤖 وضع منع البوتات:*\n\n` +
        `الحالة: ${detector.antiBotMode ? '✅ طرد فوري' : '⚠️ إنذار 3 مرات'}\n\n` +
        `*.ضد_البوتات on* → طرد فوري\n` +
        `*.ضد_البوتات off* → إنذار 3 مرات`
    );
};

handler.command  = ['ضد_البوتات', 'anti_bot_mode'];
handler.usage    = ['ضد_البوتات on/off'];
handler.owner    = true;
handler.category = 'settings';
export default handler;
