const getGroupData = (chat) => {
    if (!global.db) return {};
    if (!global.db.groupExtra) global.db.groupExtra = {};
    if (!global.db.groupExtra[chat]) {
        global.db.groupExtra[chat] = { polls: {}, giveaways: {}, attendance: null, slowmode: 0, chatCount: {} };
    }
    return global.db.groupExtra[chat];
};

const isGroupAdmin = (m) => m.isAdmin || m.isSuperAdmin;

const handler = async (m, { conn, command, text, args }) => {
    if (!m.chat?.endsWith('@g.us')) return m.reply('*⚠️ الأمر ده يشتغل جوه الجروبات بس*');
    const data = getGroupData(m.chat);

    if (command === 'تصويت') {
        if (!isGroupAdmin(m)) return m.reply('*❌ للأدمن بس يا نجم*');
        const parts = (text || '').split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length < 3) return m.reply('*⚠️ الصيغة:*\n`تصويت السؤال | اختيار1 | اختيار2 | ...`');
        const [question, ...options] = parts;
        const pollId = `P${Date.now()}`;
        data.polls[pollId] = { question, options, votes: {} };

        let txt = `╭─┈─┈─⟞🗳️⟝─┈─┈─╮\n┃ *${question}*\n╰─┈─┈─⟞📊⟝─┈─┈─╯\n\n`;
        options.forEach((o, i) => { txt += `${i + 1}. ${o}\n`; });
        txt += `\n> صوّت بكتابة: \`صوت ${pollId} رقم_الاختيار\``;
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

    if (command === 'صوت') {
        const [pollId, choiceStr] = (text || '').trim().split(/\s+/);
        const poll = data.polls[pollId];
        const choice = parseInt(choiceStr, 10);
        if (!poll || !choice || choice < 1 || choice > poll.options.length) {
            return m.reply('*⚠️ اكتب رقم التصويت والاختيار صح*\n> مثال: `صوت P123 1`');
        }
        poll.votes[m.sender] = choice;
        return m.reply('*✅ اتسجل صوتك*');
    }

    if (command === 'نتيجة_التصويت') {
        const pollId = text?.trim();
        const poll = data.polls[pollId];
        if (!poll) return m.reply('*⚠️ التصويت ده مش موجود*');
        const counts = poll.options.map((_, i) => Object.values(poll.votes).filter(v => v === i + 1).length);
        let txt = `╭─┈─┈─⟞📊⟝─┈─┈─╮\n┃ *${poll.question}*\n╰─┈─┈─⟞🗳️⟝─┈─┈─╯\n\n`;
        poll.options.forEach((o, i) => { txt += `${o}: ${counts[i]} صوت\n`; });
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

    if (command === 'هدية_جماعية') {
        if (!isGroupAdmin(m)) return m.reply('*❌ للأدمن بس يا نجم*');
        const prize = text?.trim();
        if (!prize) return m.reply('*⚠️ اكتب الجايزة*\n> مثال: `هدية_جماعية اشتراك مميز لمدة شهر`');
        const giveawayId = `G${Date.now()}`;
        data.giveaways[giveawayId] = { prize, participants: [], startedBy: m.sender, active: true };
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─⟞🎁⟝─┈─┈─╮\n┃ *هدية جماعية جديدة!*\n╰─┈─┈─⟞🎉⟝─┈─┈─╯\n\n` +
                `🏆 الجايزة: ${prize}\n\n` +
                `> شارك بكتابة: \`اشترك ${giveawayId}\`\n` +
                `> الأدمن يقفل السحب بـ: \`اسحب_الفايز ${giveawayId}\``
        }, { quoted: m });
    }

    if (command === 'اشترك') {
        const gid = text?.trim();
        const giveaway = data.giveaways[gid];
        if (!giveaway || !giveaway.active) return m.reply('*⚠️ الهدية دي مش موجودة أو خلصت*');
        if (giveaway.participants.includes(m.sender)) return m.reply('*✅ إنت مشترك بالفعل*');
        giveaway.participants.push(m.sender);
        return m.reply('*🎉 اتسجلت في السحب، بالتوفيق!*');
    }

    if (command === 'اسحب_الفايز') {
        if (!isGroupAdmin(m)) return m.reply('*❌ للأدمن بس يا نجم*');
        const gid = text?.trim();
        const giveaway = data.giveaways[gid];
        if (!giveaway) return m.reply('*⚠️ الهدية دي مش موجودة*');
        if (giveaway.participants.length === 0) return m.reply('*😅 محدش اشترك للأسف*');
        const winner = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
        giveaway.active = false;
        return conn.sendMessage(m.chat, {
            text: `🎊 *مبروك! الفايز بـ "${giveaway.prize}" هو:*\n@${winner.split('@')[0]}`,
            mentions: [winner]
        }, { quoted: m });
    }

    if (command === 'تسجيل_حضور') {
        if (!isGroupAdmin(m)) return m.reply('*❌ للأدمن بس يا نجم*');
        data.attendance = { list: [], startedAt: Date.now(), active: true };
        return m.reply('*✅ اتفتح تسجيل الحضور، اكتبوا `حاضر` عشان تتسجلوا*');
    }

    if (command === 'حاضر') {
        if (!data.attendance?.active) return m.reply('*⚠️ مفيش تسجيل حضور مفتوح دلوقتي*');
        if (data.attendance.list.includes(m.sender)) return m.reply('*✅ إنت متسجل بالفعل*');
        data.attendance.list.push(m.sender);
        return m.reply('*✅ اتسجل حضورك*');
    }

    if (command === 'قائمة_الحضور') {
        if (!data.attendance) return m.reply('*⚠️ مفيش تسجيل حضور حصل لسه*');
        const list = data.attendance.list;
        if (list.length === 0) return m.reply('*📭 لسه محدش سجل حضور*');
        let txt = `╭─┈─┈─⟞📋⟝─┈─┈─╮\n┃ *الحاضرين (${list.length})*\n╰─┈─┈─⟞✅⟝─┈─┈─╯\n\n`;
        list.forEach((j, i) => { txt += `${i + 1}. @${j.split('@')[0]}\n`; });
        return conn.sendMessage(m.chat, { text: txt, mentions: list }, { quoted: m });
    }

    if (command === 'الأكثر_دردشة') {
        let meta;
        try { meta = await conn.groupMetadata(m.chat); } catch { return m.reply('*❌ مقدرتش أجيب بيانات الجروب*'); }
        const ranked = meta.participants
            .map(p => ({ jid: p.id, count: Number(global.db?.users?.[p.id]?.msgcount) || 0 }))
            .filter(u => u.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        if (ranked.length === 0) return m.reply('*📭 مفيش بيانات كفاية لسه*');
        let txt = `╭─┈─┈─⟞💬⟝─┈─┈─╮\n┃ *الأكثر دردشة في الجروب*\n╰─┈─┈─⟞🏆⟝─┈─┈─╯\n\n`;
        ranked.forEach((u, i) => { txt += `${i + 1}. @${u.jid.split('@')[0]} — ${u.count} رسالة\n`; });
        return conn.sendMessage(m.chat, { text: txt, mentions: ranked.map(u => u.jid) }, { quoted: m });
    }
};

handler.usage    = ['تصويت', 'صوت', 'نتيجة_التصويت', 'هدية_جماعية', 'اشترك', 'اسحب_الفايز', 'تسجيل_حضور', 'حاضر', 'قائمة_الحضور', 'الأكثر_دردشة'];
handler.category = 'group';
handler.command  = ['تصويت', 'صوت', 'نتيجة_التصويت', 'هدية_جماعية', 'اشترك', 'اسحب_الفايز', 'تسجيل_حضور', 'حاضر', 'قائمة_الحضور', 'الأكثر_دردشة'];
handler.cooldown = 1500;

export default handler;
