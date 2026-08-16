import fs from 'fs';
import path from 'path';

const ff = async (m, { conn, text, command }) => {
    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    
    if (!target && text?.includes('@')) {
        target = text.replace('@', '') + '@s.whatsapp.net';
    }
    
    if (!target) {
        return m.reply(`*~ 💙 منشن شخص مثل /${command} @${m.sender.split('@')[0]} ❤️ ~*`);
    }
    
    const jid = await m.lid2jid(target);
    const user = global.db.users[jid] || {};
    
    const isUnban = command === "فك_حظر_من_البوت" || command === "الغاء_الحظر_من_البوت";
    
    if (isUnban) {
        if (user.banned) {
            delete user.banned;
            await conn.sendMessage(m.chat, { 
                text: `*✅ ~ حظر @${target.split('@')[0]} اتشال*\n> *_دلوقت يقدر يكلم البوت عادي_*`, 
                mentions: [target] 
            });
        } else {
            m.reply(`*❌ ~ اليوزر ده مش محظور أصلاً*`);
        }
        return;
    }
    
    user.banned = true;
    await conn.sendMessage(m.chat, { 
        text: `*✅ ~ @${target.split('@')[0]} اتحظر*\n> *_مش هيعرف يكلم البوت تاني_*`, 
        mentions: [target] 
    });
};

ff.usage = ["حظر_من_البوت", "فك_حظر_من_البوت"];
ff.category = "owner";
ff.command = ["حظر_من_البوت", "فك_حظر_من_البوت", "الغاء_الحظر_من_البوت"];
ff.owner = true;

export default ff;