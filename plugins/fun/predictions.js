// تنبؤات وأسئلة - هل، جاوب، شخصيه، صراحه
// (برجي اتنقل لقسم primbon في ملف تسلية_روحانية.js - كان متكرر هنا وبيعمل تعارض)
const DATA = {
    هل:      ['أيوه أكيد! ✅','لأ خالص ❌','يمكن... 🤔','الموضوع مش واضح 🌫️','50/50 يا صاحبي 😂','سؤال صعب أوي! 🤯'],
    جاوب:   ['الجواب: أيوه ✅','الجواب: لأ ❌','الجواب: يمكن 🤔','الجواب: بكرة 📅','الجواب: مش عارف 🤷'],
    شخصيه: ['🦁 شخصيتك: قائد قوي!','🦋 شخصيتك: حالمة وجميلة!','🐺 شخصيتك: وحيد متحدٍّ!','🦊 شخصيتك: ذكي ومراوغ!','🐬 شخصيتك: اجتماعي ومحبوب!'],
    صراحه: ['🎯 بصراحة؟ أنت تمام!','💬 صراحة: ما فيش زيك!','😶 صراحة: مش قادر أقول!','🔥 صراحة: ده كلام!','💯 صراحة: عندك حق!'],
};
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const handler = async (m, { conn, command }) => {
    const target  = m.mentionedJid?.[0] || m.quoted?.sender;
    const mention = target ? `@${target.split('@')[0]}` : (m.pushName || 'صاحبي');
    return conn.sendMessage(m.chat, {
        text: `${mention}\n\n${rnd(DATA[command])}`,
        mentions: target ? [target] : []
    }, { quoted: m });
};
handler.usage    = Object.keys(DATA);
handler.category = 'fun';
handler.command  = Object.keys(DATA);
export default handler;
