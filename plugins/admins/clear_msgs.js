const handler = async (m, { conn, command, args }) => {

    if (command === 'مسح') {
        const count = parseInt(args[0]);

        if (!count || isNaN(count)) {
            try {
                return conn.sendButton(m.chat, {
                    bodyText: '*🗑️ اختار عدد الرسائل للمسح*',
                    footerText: '𝐎𝐑𝐀𝐂𝐋𝐄 BOT',
                    buttons: [
                        { name: 'quick_reply', params: { display_text: '🗑️ مسح 10', id: '.مسح 10' } },
                        { name: 'quick_reply', params: { display_text: '🗑️ مسح 50', id: '.مسح 50' } },
                        { name: 'quick_reply', params: { display_text: '🗑️ مسح 100', id: '.مسح 100' } },
                    ],
                    mentions: [m.sender],
                    interactiveConfig: { buttons_limits: 3 }
                }, m);
            } catch {
                return m.reply('*مثال:* .مسح 10 | .مسح 50 | .مسح 100');
            }
        }

        if (count < 1 || count > 500) return m.reply('*اختار رقم بين 1 و 500*');

        // احذف رسالة الأمر نفسها أولاً
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}

        let deleted = 0;
        const errors = [];

        // نستخدم store الـ messages المخزنة في الـ chat
        try {
            const store = conn.store || conn.chatStore;
            const chatMessages = store?.messages?.[m.chat]?.array ||
                                 store?.messages?.get?.(m.chat)?.array || [];

            // ناخد آخر count رسالة قبل رسالة الأمر
            const toDelete = chatMessages
                .filter(msg => msg.key.id !== m.key.id)
                .slice(-count);

            for (const msg of toDelete.reverse()) {
                try {
                    await conn.sendMessage(m.chat, { delete: msg.key });
                    deleted++;
                    await new Promise(r => setTimeout(r, 150));
                } catch {}
            }
        } catch {
            // fallback إذا مفيش store
            errors.push('store not available');
        }

        const notif = await conn.sendMessage(m.chat, {
            text: `✅ *اتمسح ${deleted} رسالة*`
        });

        // احذف رسالة التأكيد بعد 3 ثواني
        setTimeout(async () => {
            try { await conn.sendMessage(m.chat, { delete: notif.key }); } catch {}
        }, 3000);
    }
};

handler.command  = ['مسح'];
handler.usage    = ['مسح 50'];
handler.admin    = true;
handler.botAdmin = true;
handler.category = 'admins';
export default handler;
