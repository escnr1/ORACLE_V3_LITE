// =============================================
// المطورين وبياناتهم - لازم تتطابق مع الـ owners في index.js
// =============================================
const OWNERS_DATA = [
    { name: '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤',  jid: '201065948582@s.whatsapp.net', lid: '110462431670456@lid', displayName: 'Venom' },
    { name: '𝐋𝐨𝐫𝐝 𝐃𝐑𝐀𝐊𝐎𝐍',  jid: '201092178171@s.whatsapp.net', lid: '275561477836913@lid', displayName: 'Lord Drakon' },
];

const getOwnerName = (jid) => {
    if (!jid) return null;
    const num = jid.split('@')[0].split(':')[0];
    const found = OWNERS_DATA.find(o =>
        o.jid.split('@')[0] === num || o.jid === jid || o.lid === jid
    );
    return found?.name || null;
};

// =============================================
// رسائل الترحيب والوداع - مع دعم اسم المطور ديناميكياً
// =============================================
const makeOwnerWelcome = (ownerName) => [
    `╭─┈─┈─┈─⟞👑⟝─┈─┈─┈─╮\n┃ *دخل المطور ${ownerName} ⚡*\n┃\n┃ يا كبير... النظام تحت أمرك 👁‍🗨\n┃ الجروب بقى في أمان 🕷️\n╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`,
    `*🔥 المطور نزل على الجروب*\n\nاستعدوا... ${ownerName} هنا 👑⚡`,
    `*⚡ تحذير - دخول المطور*\n\n${ownerName} دخل الجروب 🕷️`,
];

const makeOwnerBye = (ownerName) => [
    `*👑 المطور ${ownerName} غادر الجروب*\n\n> النظام في وضع الحراسة الذاتية 🕷️`,
    `*⚡ المطور خرج*\n\n${ownerName} قرر يمشي... من يجرؤ الآن؟ ☠️`,
];

// رسالة البوت لما المطور يكتب "بوت"
const makeBotReply = (ownerName) =>
    `╭─┈─┈─┈─⟞👑⟝─┈─┈─┈─╮\n┃ *أهلاً ${ownerName} 🔥*\n┃ البوت شغال وجاهز 🕷️\n╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`;

const SUPPORT_TEAM = [
    { name: '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤', url: 'https://wa.me/201065948582' },
    { name: '𝑆𝐴𝑌𝐾𝑂 ~ 𝑆𝐾',    url: 'https://wa.me/201090406441' }
];

// =============================================
// group - أحداث المجموعات
// =============================================
const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;

        const users = participants.length
            ? participants.map(p => '@' + p.split('@')[0]).join(' and ')
            : 'No users';
        const authorTag = author ? '@' + author.split('@')[0] : 'Unknown';

        const messages = {
            add:     `*مـنــور/ه  يـخــويـا/يجمده الــبـار🥸* ${users}${authorTag === users ? '' : `\n𝐛𝐲 ${authorTag}`}`,
            remove:  `${users} غـادر كـلـب يـجـي مـحـتـرم🐤 ..... الـخـرابـة${authorTag === users ? '' : `\n𝐛𝐲 ${authorTag}`}`,
            promote: `♡゙ مـبـروك الادمـن ${users}\nby ${authorTag}`,
            demote:  `♡゙ بـقـيـت عـضـو خـلاص ${users}\nby ${authorTag}`
        };

        const txt = messages[eventType];
        if (!txt) return null;

        const disabled = global._gs?.[event.chat]?.welcomeDisabled;
        if (disabled) return 9999;

        // لو المطور اللي دخل أو خرج
        if (['add', 'remove'].includes(eventType) && participants.length) {
            const owners = ctx.config?.owners || [];
            const isOwnerAffected = participants.some(p =>
                owners.some(o => p === o.jid || p === o.lid)
            );

            if (isOwnerAffected) {
                // جيب اسم المطور من الـ participants
                const ownerParticipant = participants.find(p =>
                    owners.some(o => p === o.jid || p === o.lid)
                );
                const ownerEntry = owners.find(o =>
                    ownerParticipant === o.jid || ownerParticipant === o.lid
                );
                const ownerName = ownerEntry?.name || getOwnerName(ownerParticipant) || '𝑶𝑹𝑨𝑪𝑳𝑬';

                const msgs = eventType === 'add' ? makeOwnerWelcome(ownerName) : makeOwnerBye(ownerName);
                const msg = msgs[Math.floor(Math.random() * msgs.length)];
                await new Promise(r => setTimeout(r, 3000));
                await ctx.sock.sendMessage(event.chat, { text: msg, mentions: participants });
                return null;
            }
        }

        // ════════════════════════════════════
        // رسالة الوداع المخصصة (لما حد عادي يطلع من الجروب)
        // ═════════════════════════════════════
        if (eventType === 'remove') {
            let meta = null;
            try { meta = await ctx.sock.groupMetadata(event.chat); } catch {}

            const groupName   = meta?.subject || 'الجروب';
            const groupDesc   = (meta?.desc && meta.desc.trim()) || 'مفيش وصف للجروب';
            const memberCount = meta?.participants?.length ?? '-';

            const now     = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

            const goodbyeText = `*💀وداعاً يا صديقي...💀*

*اسم الجروب : ${groupName}🕶*

👤*الدمج الي طلع: @${(participants[0] || '').split('@')[0]}*

*📝الرسالة : خد الباب فأيدك وانت طالع*

*📋وصف المجموعة :*

*${groupDesc}*

*👥عدد الي موجودين دلوقتي:  ${memberCount}*

*📅 التاريخ: ${dateStr}*

*بوت العرآف بيقولك مسيرك ترجع تاني.*
> 𝑂𝒓𝒂𝒄𝒍𝒆 𝑩𝒐𝒕`;

            await new Promise(r => setTimeout(r, 3000));
            try {
                await ctx.sock.sendMessage(event.chat, {
                    text: goodbyeText,
                    mentions: participants
                });
            } catch (e) { console.error('[group event - remove]', e.message); }
            return null;
        }

        const img = eventType === 'add'
            ? (event.userUrl || 'https://i.postimg.cc/RFqPQkhZ/8653766a329a5a5a714e221e9aa67e3a.jpg')
            : 'https://i.postimg.cc/xd6xmf0p/9e0c32d018f9bea5a756fffa76e95b3a.jpg';

        const mentions = author ? [author, ...participants] : participants;

        await new Promise(r => setTimeout(r, 3000));

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: ctx.config?.info?.nameBot || 'ORACLE',
            body: '𝐴 𝑠𝑖𝑚𝑝𝑙𝑒 𝑊ℎ𝑎𝑡𝑠𝐴𝑝𝑝 𝑏𝑜𝑡 𝑓𝑜𝑟 𝑏𝑒𝑔𝑖𝑛𝑛𝑒𝑟𝑠, 𝑏𝑦 𝑂𝑅𝐴𝐶𝐿𝐸',
            mentions,
            newsletter: { name: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦', jid: '120363422581600030@newsletter' },
            big: eventType === 'add'
        });

    } catch (e) { console.error('[group event]', e.message); }
    return null;
};

// =============================================
// access - رسائل التحقق من الصلاحيات
// (بيتشغل قبل كل أمر - هنا بنضيف check الـ toggle)
// =============================================
const access = async (msg, checkType, time) => {
    const conn = await msg.client();

    // ═════════════════════════════════════
    // نظام الخصوصية للبوتات الفرعية (.خاص_فرعي / .عام_فرعي)
    // كل بوت فرعي عنده جلسته الخاصة (bot.id) - التفعيل في بوت
    // معين متأثرش خالص على أي بوت فرعي تاني حتى لو نفس الكود بالظبط
    // ═════════════════════════════════════
    const botInst = msg._bot;
    if (botInst?.isSubBot && botInst?.id) {
        const mode = global.__subPrivacy?.[botInst.id];
        if (mode === 'private') {
            const ownNum    = (conn?.user?.id || '').split(':')[0].split('@')[0];
            const senderNum = (msg.sender  || '').split('@')[0].split(':')[0];
            const isSessionOwner = !!ownNum && !!senderNum && ownNum === senderNum;

            // مش صاحب الجلسة؟ تجاهل تام - بلاش أي رد على الإطلاق
            if (!isSessionOwner) return false;
        }
    }

    // ── الكولداون (استنى X ثانية) اتلغى خالص بناءً على طلب المطور ──
    // مفيش حد اتحظر أو اتمنع، الأوامر بقت تشتغل فورًا من غير أي تأخير
    // لازم false مش null - المكتبة بتفحص "if (i != null) return" يعني
    // null/undefined = "مفيش قرار، ابعتي إنتي رسالتك الافتراضية"
    // أي حاجة تانية (زي false) = "خلاص اتعامل معاها، بلاش رسالتك"
    if (checkType === 'cooldown') return false;

    // === Check للـ toggle system ===
    // لو checkType مش موجود معناه البوت بيحاول يشغل أمر عادي
    // نشوف لو الأمر أو قسمه موقف
    if (!checkType && !msg.isOwner) {
        const sys = global._gs?.__system;
        if (sys && (sys.disabledCommands?.length || sys.disabledCategories?.length)) {
            const body = (msg.body || msg.text || '').trim();
            // نجيب الـ command من body
            const { command: msgCmd, category: msgCat } = _extractMsgCmd(body, msg._bot || conn);

            if (msgCmd && sys.disabledCommands?.includes(msgCmd)) {
                await conn?.sendMessage(msg.chat, {
                    text: '*「💥」 الامـر دا أوراكل مـطـوري مـوقـفـو*'
                });
                return false;
            }

            if (msgCat && sys.disabledCategories?.includes(msgCat)) {
                await conn?.sendMessage(msg.chat, {
                    text: '*「💥」 الـقـسـم دا أوراكل مـطـوري مـوقـفـو*'
                });
                return false;
            }
        }
    }

    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };

    const messages = {
        cooldown: `*♡⏳ استنى ${time ? Math.ceil(time / 1000) : 'بعض كام'} ثانية*`,
        owner:    `*「🔥」الامـر دا بـتـاع أوراكل مـطـوري.*`,
        group:    `*♡ الأمر ده في الجروبات بس ♡*`,
        admin:    `*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*`,
        private:  `*「💥」 الامـر دا فـي الـخـاص بـس يـسـطـا*`,
        botAdmin: `*「💥」 ارفـعـني مـشـرف يـسـطـا وبـعـدين نـفـز الامـر*`,
        noSub:    `* 「😈」 الامر دا في البوت الرئيسي يسطا *`,
        disabled: `*「💥」 الامـر دا أوراكل مـطـوري مـوقـفـو*`,
        error:    `*الأمر في ايرور كلم المطور او فريق الدعم 「👥」*`
    };

    if (conn && messages[checkType]) {
        try {
            if (checkType === 'error') {
                await conn.sendButton(msg.chat, {
                    imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
                    bodyText: messages[checkType],
                    footerText: '𝐎𝐑𝐀𝐂𝐋𝐄 Support Team',
                    buttons: SUPPORT_TEAM.map(s => ({
                        name: 'cta_url',
                        params: { display_text: `🛡️ ${s.name}`, url: s.url }
                    })),
                    mentions: [msg.sender],
                    newsletter: { name: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦', jid: '120363422581600030@newsletter' },
                    interactiveConfig: { buttons_limits: 2 }
                }, quoted);
            } else {
                await conn.msgUrl(msg.chat, messages[checkType], {
                    img: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
                    title: '𝐀𝐥𝐞𝐫𝐭𝐬 | 𝐖𝐚𝐫𝐧𝐢𝐧𝐠𝐬',
                    body: '𝐵𝑜𝑡 𝑎𝑙𝑒𝑟𝑡𝑠',
                    newsletter: { name: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦', jid: '120363422581600030@newsletter' },
                    big: false
                }, quoted);
            }
        } catch {
            await conn.sendMessage(msg.chat, { text: messages[checkType] });
        }
        return false;
    }
    return null;
};

// helper - استخراج command + category من body
let __cmdMap = null;
let __cmdMapAt = 0;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _buildMap = (base) => {
    const now = Date.now();
    if (__cmdMap && now - __cmdMapAt < 60_000) return __cmdMap;
    const map = {};
    const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const item of fs.readdirSync(dir)) {
            const p = path.join(dir, item);
            try {
                const st = fs.statSync(p);
                if (st.isDirectory()) { walk(p); continue; }
                if (!item.endsWith('.js')) continue;
                const content = fs.readFileSync(p, 'utf8');
                const catM = content.match(/\.category\s*=\s*['"]([^'"]+)['"]/);
                const cat = catM?.[1] || path.basename(path.dirname(p));
                const arr = content.match(/\.command\s*=\s*\[([^\]]*)\]/);
                if (arr) arr[1].split(',').forEach(s => {
                    const v = s.trim().replace(/^['"]|['"]$/g, '');
                    if (v) map[v.toLowerCase()] = cat;
                });
                const single = content.match(/\.command\s*=\s*['"]([^'"]+)['"]/);
                if (single) map[single[1].toLowerCase()] = cat;
            } catch {}
        }
    };
    walk(base);
    __cmdMap = map;
    __cmdMapAt = now;
    return map;
};

const _extractMsgCmd = (body, connOrBot) => {
    if (!body) return { command: null, category: null };
    const prefixes = connOrBot?.config?.prefix || ['.', '/', '!'];
    const pfxArr = Array.isArray(prefixes) ? prefixes : [prefixes];
    for (const p of pfxArr) {
        if (body.startsWith(p)) {
            const cmd = body.slice(p.length).split(/\s+/)[0]?.toLowerCase() || null;
            const base = connOrBot?.config?.commandsPath || './plugins';
            const map = _buildMap(base);
            return { command: cmd, category: cmd ? map[cmd] : null };
        }
    }
    return { command: null, category: null };
};

export { access, group, makeBotReply, getOwnerName };
