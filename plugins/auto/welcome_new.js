// ترحيب ووداع - نفس طريقة سيلينا باستخدام messageStubType

const OWNER_WELCOME = [
    `╭─┈─┈─┈─⟞👑⟝─┈─┈─┈─╮\n┃ *دخل المطور 𝑶𝑹𝑨𝑪𝑳𝑬 ⚡*\n┃ يا كبير... النظام تحت أمرك 👁‍🗨\n╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`,
    `*🔥 المطور نزل على الجروب*\n\n𝑶𝑹𝑨𝑪𝑳𝑬 هنا 👑⚡`,
];

const OWNER_BYE = [
    `*👑 المطور 𝑶𝑹𝑨𝑪𝑳𝑬 غادر الجروب*\n> النظام في وضع الحراسة الذاتية 🕷️`,
    `*⚡ المطور خرج...*\n> من يجرؤ الآن؟ ☠️`,
];

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'ORACLE'
    },
    message: {
        contactMessage: {
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:ORACLE\nitem1.TEL;waid=0:0\nEND:VCARD`
        }
    },
    participant: '0@s.whatsapp.net'
};

export default async function before(m, { conn, bot }) {
    if (!m.isGroup) return false;
    if (!m.messageStubType) return false;

    // أنواع stub في الـ framework
    // ADD = 27 أو 'GROUP_PARTICIPANT_ADD' أو 'GROUP_PARTICIPANT_INVITE'
    // REMOVE/LEAVE = 28/32 أو الأسماء المناظرة
    const stubType = m.messageStubType;
    const stubParams = m.messageStubParameters || [];

    if (!stubParams.length) return false;

    const isAdd = [
        27, 28, // ADD, INVITE
        'GROUP_PARTICIPANT_ADD',
        'GROUP_PARTICIPANT_INVITE',
        'GROUP_PARTICIPANT_INVITE_LINK_JOINED'
    ].includes(stubType);

    const isRemove = [
        30, 31, 32, // REMOVE, LEAVE
        'GROUP_PARTICIPANT_REMOVE',
        'GROUP_PARTICIPANT_LEAVE'
    ].includes(stubType);

    if (!isAdd && !isRemove) return false;

    // الترحيب مغلق؟
    const disabled = global._gs?.[m.chat]?.welcomeDisabled;
    if (disabled) return false;

    const userJid = stubParams[0];
    if (!userJid) return false;

    const username = userJid.split('@')[0];
    const mention = '@' + username;

    // جيب بيانات الجروب
    let groupName = '';
    let memberCount = 0;
    try {
        const meta = await conn.groupMetadata(m.chat);
        groupName = meta.subject || '';
        memberCount = meta.participants?.length || 0;
    } catch {}

    // صورة البروفيل
    let avatarUrl = 'https://i.postimg.cc/RFqPQkhZ/8653766a329a5a5a714e221e9aa67e3a.jpg';
    try {
        avatarUrl = await conn.profilePictureUrl(userJid, 'image');
    } catch {}

    // ترحيب/وداع خاص للمطور
    const owners = bot?.config?.owners || [];
    const isOwner = owners.some(o => userJid === o.jid || userJid === o.lid);

    if (isOwner) {
        await new Promise(r => setTimeout(r, 3000));
        const msgs = isAdd ? OWNER_WELCOME : OWNER_BYE;
        await conn.sendMessage(m.chat, {
            text: msgs[Math.floor(Math.random() * msgs.length)],
            mentions: [userJid]
        });
        return false;
    }

    await new Promise(r => setTimeout(r, 3000));

    if (isAdd) {
        const txt =
            `♡゙ مـنـور/ه @${username}\n\n` +
            `╭─┈─┈─┈─⟞🎉⟝─┈─┈─┈─╮\n` +
            `┃ *أهـلاً بـك في ${groupName}*\n` +
            `┃ 👥 عدد الأعضاء: ${memberCount}\n` +
            `╰─┈─┈─┈─⟞🎊⟝─┈─┈─┈─╯`;

        try {
            await conn.sendMessage(m.chat, {
                image: { url: avatarUrl },
                caption: txt,
                mentions: [userJid],
                contextInfo: {
                    mentionedJid: [userJid],
                    isForwarded: true,
                    forwardingScore: 1,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363422581600030@newsletter',
                        newsletterName: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦',
                        serverMessageId: 0
                    }
                }
            }, { quoted: fkontak });
        } catch {
            await conn.sendMessage(m.chat, { text: txt, mentions: [userJid] });
        }

    } else if (isRemove) {
        const txt = `${mention} اتشال من الجروب 👋\n\n> عدد الأعضاء: ${memberCount}`;
        try {
            await conn.sendMessage(m.chat, {
                image: { url: avatarUrl },
                caption: txt,
                mentions: [userJid]
            }, { quoted: fkontak });
        } catch {
            await conn.sendMessage(m.chat, { text: txt, mentions: [userJid] });
        }
    }

    return false;
}
