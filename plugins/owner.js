// أسامي المطورين وبياناتهم
const DEVS = {
    'فينوم':    { name: '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤',  jid: '201065948582' },
    'venom':    { name: '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤',  jid: '201065948582' },
    'سايكو':    { name: '𝑆𝐴𝑌𝐾𝑂 ~ 𝑆𝐾',     jid: '201090406441' },
    'sayko':    { name: '𝑆𝐴𝑌𝐾𝑂 ~ 𝑆𝐾',     jid: '201090406441' },
    'sk':       { name: '𝑆𝐴𝑌𝐾𝑂 ~ 𝑆𝐾',     jid: '201090406441' },
    'ديث_نوت':  { name: '𝐃𝐄𝐀𝐓𝐇 𝐍𝛩𝐓𝐄',    jid: '201204302942' },
    'ديث نوت':  { name: '𝐃𝐄𝐀𝐓𝐇 𝐍𝛩𝐓𝐄',    jid: '201204302942' },
    'death':    { name: '𝐃𝐄𝐀𝐓𝐇 𝐍𝛩𝐓𝐄',    jid: '201204302942' },
    'لورد':     { name: '𝐋𝐨𝐫𝐝 𝐄𝐒𝐂𝐀𝐍𝛩𝐑',  jid: '201092178171' },
    'lord':     { name: '𝐋𝐨𝐫𝐝 𝐄𝐒𝐂𝐀𝐍𝛩𝐑',  jid: '201092178171' },
};

let handler = async (m, { conn, bot, text, args, command }) => {
    // هات الاسم من text أو من body على طول (احتياطي للـ regex commands)
    let arg = (text || '').trim().toLowerCase();

    // لو text فاضي هجيب من body على طول (لو الـ regex أخد أول كلمة بس)
    if (!arg && m.body) {
        const body = m.body.trim();
        // اقطع الـ prefix + command وهات الباقي
        const parts = body.split(/\s+/);
        if (parts.length > 1) {
            arg = parts.slice(1).join(' ').toLowerCase();
        }
    }

    let watermark;
    let num;

    if (arg) {
        const dev = DEVS[arg];
        if (!dev) {
            const list = [...new Set(Object.values(DEVS).map(d => d.name))].join('\n');
            return m.reply(`*❌ المطور ده مش معروف عندنا*\n\n*الأسامي الموجودة:*\n${list}\n\n*مثال:* .مطور فينوم`);
        }
        watermark = dev.name;
        num = dev.jid;
    } else {
        // من غير ما تكتب اسم - هيجيب كارت أول مطور في الـ owners
        watermark = bot?.config?.owners?.[0]?.name || '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤';
        num = bot?.config?.owners?.[0]?.jid?.split('@')[0] || '201065948582';
    }

    const quoted = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: { conversation: 'ORACLE👨🏻‍💻🔥' }
    };

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${watermark}\nTEL;type=CELL;waid=${num}:+${num}\nEND:VCARD`;
    const img = 'https://i.postimg.cc/JntTcfnP/782d05642e3887d29ed37900aa767c6a.jpg';

    await conn.sendMessage(m.chat, {
        contacts: { displayName: watermark, contacts: [{ vcard }] },
        contextInfo: {
            forwardingScore: 2023,
            externalAdReply: {
                title: '𝑇𝛨𝛯 𝛩𝑊𝛮𝛯𝑅',
                body: watermark,
                sourceUrl: 'https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f',
                thumbnailUrl: img,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted });
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;
