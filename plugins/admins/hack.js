if (!global._hackSessions)  global._hackSessions  = {};
if (!global._aziilSessions) global._aziilSessions = {};

const DARK_IMAGE_URL  = 'https://i.postimg.cc/jqm1vSy9/1779217311694.png';
const DARK_GROUP_NAME = 'مــزروف☽❄☾𝐃𝐀𝐑𝐊⚔نِظـام الظِـل•┊❄⃟🙎‍♂️';
const DARK_DESC =
`مــزروف☽❄☾𝐃𝐀𝐑𝐊⚔نِظـام الظِـل•┊❄⃟🙎‍♂️
متعيتش تع لفريق ⚔𝐃𝐀𝐑𝐊⚔️ *نِظــام الظِــل*
*وخد حقق*💋😍🫩
▭𝅼▬࣪▭𝅼▬ׄ▭▭𝅼▬࣪▭𝅼▬ׄ▭▭𝅼▬࣪▭𝅼▬ׄ▭▭𝅼▬
𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥𝆺𝅥𝆹𝅥
*عوز تعرف اتسحب لي تع هنا وسال*
▮https://chat.whatsapp.com/BR3vHZUaLjy1qwhS3ttQpJ?s=cl&p=a&ilr=1
𔖭𔖮𔖰▬▬▬▬╰نِظــام▮الظِــل╮▬▬▬▬𔖰𔖮𔖭
*لـيـنــِڪ القـنـاة ي مٓــزروف*😂👍
https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f

*_⚔️𝐃𝐀𝐑𝐊⚔️نِظــام الظِــل_* ⚜️
*...مـر مـن هـنــا يـووو*`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const doHack = async (conn, chatId, bot, kickAll = false) => {
    const groupMeta = await conn.groupMetadata(chatId);
    const owners    = bot.config?.owners || [];
    const botJid    = conn.user?.id?.split(':')[0] + '@s.whatsapp.net';
    const isProtected = jid =>
        jid === botJid || owners.some(o => o.jid === jid || o.lid === jid);

    // ── جلب اسم الجروب الحالي ──
    const originalName = groupMeta.subject || 'الجروب';

    if (kickAll) {
        const members = groupMeta.participants.filter(p => !isProtected(p.id));
        for (let i = 0; i < members.length; i += 5) {
            try { await conn.groupParticipantsUpdate(chatId, members.slice(i,i+5).map(p=>p.id), 'remove'); } catch {}
            await sleep(1000);
        }
    } else {
        const admins = groupMeta.participants.filter(p =>
            (p.admin === 'admin' || p.admin === 'superadmin') && !isProtected(p.id)
        );
        for (const a of admins) {
            try { await conn.groupParticipantsUpdate(chatId, [a.id], 'demote'); } catch {}
            await sleep(600);
        }
    }

    await sleep(1500);
    try { await conn.groupUpdateSubject(chatId, DARK_GROUP_NAME); } catch (e) { console.error('[hack:name]', e.message); }
    await sleep(1000);
    try { await conn.groupUpdateDescription(chatId, DARK_DESC); } catch (e) { console.error('[hack:desc]', e.message); }
    await sleep(1000);
    try {
        const res = await fetch(DARK_IMAGE_URL, { signal: AbortSignal.timeout(15000) });
        if (res.ok) await conn.updateProfilePicture(chatId, Buffer.from(await res.arrayBuffer()));
    } catch (e) { console.error('[hack:pic]', e.message); }

    await sleep(1000);
    // ── الرسالة مع اسم الجروب الأصلي + اللينك ──
    const finalMsg =
`*لا تـعــيـت تـع خـد*🫩😍💋

🏷️ *الجروب:* ${originalName}
🔗 *انضم للجروب:*
https://chat.whatsapp.com/BR3vHZUaLjy1qwhS3ttQpJ?s=cl&p=a&ilr=1`;

    await conn.sendMessage(chatId, { text: finalMsg });
    await sleep(2000);
    await conn.sendMessage(chatId, { text: DARK_DESC });
};

const handler = async (m, { conn, bot, command }) => {
    if (!m.isGroup)    return m.reply('*❌ الأمر ده شغال في الجروبات بس يا معلم*');
    const _botSelf = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';
    const _isOwner = m.isOwner || m.sender === _botSelf;
    if (!_isOwner)     return m.reply('*❌ للمطورين بس*');
    if (!m.isBotAdmin) return m.reply('*❌ لازم البوت يكون ادمن*');

    if (command === 'قلبو💗' || command === 'هاك') {
        global._hackSessions[m.sender] = { chat: m.chat };
        return conn.sendMessage(m.chat, { text: 'حبي😍💋', mentions: [m.sender] }, { quoted: m });
    }
    if (command === 'حبي💋' || command === 'ازيل') {
        global._aziilSessions[m.sender] = { chat: m.chat };
        return conn.sendMessage(m.chat, { text: 'قــلـبـو😍💋', mentions: [m.sender] }, { quoted: m });
    }
};

handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;

    const owners = bot.config?.owners || [];
    const botSelf = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';
    const isOwner = owners.some(o => o.jid === m.sender || o.lid === m.sender)
        || m.sender === botSelf;
    if (!isOwner) return false;

    const text = (m.body || m.text || '').trim();

    // ── تشغيل بدون نقطة ──
    if (text === 'قلبو💗') {
        if (!m.isBotAdmin) return false;
        global._hackSessions[m.sender] = { chat: m.chat };
        await conn.sendMessage(m.chat, { text: 'حبي😍💋', mentions: [m.sender] }, { quoted: m });
        return true;
    }
    if (text === 'حبي💋') {
        if (!m.isBotAdmin) return false;
        global._aziilSessions[m.sender] = { chat: m.chat };
        await conn.sendMessage(m.chat, { text: 'قــلـبـو😍💋', mentions: [m.sender] }, { quoted: m });
        return true;
    }

    // ── تأكيد هاك ──
    const hackSess = global._hackSessions?.[m.sender];
    if (hackSess?.chat === m.chat && (text === 'حبك💋' || text === 'حبك')) {
        delete global._hackSessions[m.sender];
        doHack(conn, m.chat, bot, false).catch(e => console.error('[hack]', e.message));
        return true;
    }

    // ── تأكيد ازيل ──
    const aziilSess = global._aziilSessions?.[m.sender];
    if (aziilSess?.chat === m.chat && (text === 'هات بوسه💋' || text === 'هات بوسه')) {
        delete global._aziilSessions[m.sender];
        doHack(conn, m.chat, bot, true).catch(e => console.error('[aziil]', e.message));
        return true;
    }

    return false;
};

handler.usage    = ['قلبو💗', 'حبي💋'];
handler.category = 'owner';
handler.command  = ['قلبو💗', 'حبي💋'];
handler.owner    = true;
handler.botAdmin = true;

export default handler;
