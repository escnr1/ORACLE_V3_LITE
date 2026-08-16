import fs from 'fs';
import { Client } from 'drakon';
import BotDetector from './libs/bot-detector.js';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import keepServerAlive from './system/keep_alive.js';
import sub from './sub.js';

/* =========== Database ========== */
if (!global.db) global.db = new UltraDB();

/* =========== Client ✏️ إعدادات تقدر تغيّرها ========== */
const client = new Client({
    phoneNumber: '380683705375',   // ✏️ رقم البوت - غيّره لو بدّلت الرقم
    prefix: ['.', '/', '!'],       // ✏️ البادئات اللي البوت بيرد عليها
    fromMe: false,                 // ⚠️ سيبها false إلا لو عايز البوت يرد على نفسه بس
    owners: [                      // ✏️ المطورين - أضف/احذف/عدّل هنا
        { name: '◥◣ 𝐕𝑬𝑵𝕆𝑀 ◢◤',   lid: '110462431670456@lid', jid: '201065948582@s.whatsapp.net' },
        { name: '𝐋𝐨𝐫𝐝 𝐃𝐑𝐀𝐊𝐎𝐍',   lid: '275561477836913@lid', jid: '201092178171@s.whatsapp.net' }
    ],
    settings: {},
    commandsPath: './plugins',     // ⚠️ متغيرش ده إلا لو نقلت فولدر البلجنز
    autoReconnect:        true,    // ⚠️ سيبها true - بتحاول توصل تاني لو النت قطع
    reconnectDelay:       3000,    // ✏️ المدة بين محاولات إعادة الاتصال (ميلي ثانية)
    maxReconnectAttempts: 999999,  // ✏️ عدد محاولات إعادة الاتصال قبل ما يستسلم
});

/* =========== ⚠️ منع إيقاف السيرفر - متلمسهاش ==========
   بتمنع الاستضافة إنها توقف السيرفر تلقائي (زي KataBump وقت تجاوز حد الرام) */
process.removeAllListeners('SIGINT');
process.removeAllListeners('SIGTERM');
process.removeAllListeners('SIGHUP');

process.on('SIGINT',  () => console.log('🛡️ SIGINT received - تم تجاهلها، السيرفر فاضل شغال'));
process.on('SIGTERM', () => console.log('🛡️ SIGTERM received - تم تجاهلها، السيرفر فاضل شغال'));
process.on('SIGHUP',  () => console.log('🛡️ SIGHUP received - تم تجاهلها، السيرفر فاضل شغال'));

/* =========== ⚠️ تحميل المطورين الإضافيين - متلمسهاش ========== */
try {
    const extra = global.db?.data?.extraOwners || [];
    if (extra.length) {
        const cleaned = extra.map(({ secondary, ...rest }) => rest);
        client.config.owners.push(...cleaned);
    }
} catch {}

try {
    client.config.owners = client.config.owners.map(({ secondary, ...rest }) => rest);
} catch {}

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== دعم تنفيذ الأوامر في القنوات (Channels) ✏️ ==========
   القنوات مالهاش مفهوم "أدمن الجروب" زي الجروبات العادية، فأي حد
   قادر يبعت رسالة في القناة أصلاً هو أونر/أدمن القناة (لأن واتساب
   نفسه بيمنع غير كده). فبنعتبره isAdmin عشان أوامر { admin: true }
   تشتغل معاه. الأوامر اللي محتاجة { group: true } هتفضل مش شغالة في
   القنوات لأنها بتعتمد على participants/metadata مش موجودة هناك. */
client.onBeforeCommand((m) => {
    if (m.chat?.endsWith('@newsletter')) {
        m.isAdmin = true;
    }
});

/* =========== Config ✏️ بيانات البوت اللي بتظهر للمستخدمين ========== */
client.config.info = {
    nameBot:     '♡ 𝑶𝑹𝑨𝑪𝑳𝑬 𝑩𝑶𝑻👨🏻‍💻 〈',                 // ✏️ اسم البوت الظاهر
    nameChannel: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦',        // ✏️ اسم قناة البوت
    idChannel:   '120363422581600030@newsletter',    // ✏️ آيدي القناة (من رابطها)
    urls: {                                           // ✏️ روابط البوت
        repo:    'https://github.com/moreand458-eng/Oracle-bot',
        api:     'https://emam-api.web.id',
        channel: 'https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f'
    },
    copyright: { pack: 'سـ ES إ', author: 'ES' },      // ✏️ حقوق الحزمة
    images: [                                          // ✏️ صور عشوائية تظهر في بعض الأوامر
        'https://i.postimg.cc/jqm1vSy9/1779217311694.png',
        'https://i.postimg.cc/PxcS6SvT/d7e8080a5326b0d93e36d85d4a897f8d.jpg',
        'https://i.postimg.cc/nzMdYyrt/ad97fb316f5da69714a7f521673217ac.jpg'
    ]
};

/* =========== Pairing Code - إشعار كود الربط ⚠️ ==========
   بيبعت كود الربط للمطور تلقائي أول ما يظهر، عشان محتاجش تفضل شايل الشاشة */
const OWNER_PHONE = '201092178171'; // ✏️ الرقم اللي هيستقبل كود الربط

const sendPairingNotification = async (code) => {
    console.log('\n' + '='.repeat(50));
    console.log(`🔑 PAIRING CODE: ${code}`);
    console.log(`📱 FOR NUMBER: 380683705375`);
    console.log('='.repeat(50) + '\n');

    // لو في اتصال شغال، ابعت الكود كرسالة واتساب للمطور كمان
    try {
        if (client.sock?.user) {
            const ownerJid = OWNER_PHONE + '@s.whatsapp.net';
            await client.sock.sendMessage(ownerJid, {
                text: `🔑 *ORACLE - Pairing Code*\n\n\`${code}\`\n\n📱 ده للرقم: 380683705375\n\nادخل الكود ده في واتساب بسرعة`
            });
        }
    } catch {}
};

const checkPairingCode = setInterval(async () => {
    try {
        const sock = client.sock;
        if (!sock) return;

        sock.ev?.on?.('connection.update', async (update) => {
            if (update?.qr || update?.pairingCode) {
                const code = update.pairingCode || update.qr;
                if (code && code.length > 3) {
                    clearInterval(checkPairingCode);
                    await sendPairingNotification(code);
                }
            }
        });
        clearInterval(checkPairingCode);
    } catch {}
}, 1000);

/* =========== Start ⚠️ ========== */
client.start();
setTimeout(() => { try { if (client.commandSystem) sub(client); } catch {} }, 3000);

/* =========== منع النوم/التعليق/التوقف 🛡️ ✏️ الأرقام دي تقدر تظبطها ========== */
keepServerAlive(client, {
    connection: { checkEveryMs: 15000, maxDisconnectedMs: 90000 }, // ✏️ كل قد إيه يفحص الاتصال
    memory:     { checkEveryMs: 60000, maxHeapMB: 700 },           // ✏️ أقصى رام قبل ما يعمل تحذير
    ping:       { everyMs: 240000 },                               // ✏️ كل قد إيه يبعت ping يفضل صاحي
});

/* =========== المكتبات المساعدة ⚠️ متلمسهاش إلا لو عارف بتعمل إيه ========== */

setTimeout(() => {
    try {
        const botDetector = new BotDetector(client, {
            ownerJid:     '201092178171@s.whatsapp.net', // ✏️ رقم إشعارات كشف البوتات
            autoWarn:     true,   // ✏️ true = يحذر تلقائي لو لقى بوت تاني في الجروب
            autoKick:     false,  // ✏️ true = يطرد تلقائي (خطير، سيبها false إلا لو متأكد)
            antiBotMode:  false,  // ✏️ true = وضع حماية أقوى ضد البوتات التانية
            sessionPaths: ['./sessions', './auth_info', './session'], // ⚠️ أماكن ملفات الجلسة
        });
        botDetector.start();
        global._botDetector = botDetector;
    } catch {}
}, 5000);

/* =========== Error Handlers ⚠️ متلمسهاش ==========
   بيتجاهل أخطاء الشبكة العادية (قطع نت مؤقت وغيره) عشان مايوقفش السيرفر لأي حاجة تافهة */
const IGNORE = [
    'rate-overlimit', 'Connection Closed', 'timed out',
    'ECONNRESET', 'ENOTFOUND', 'fetch failed',
    'Socket connection timeout', 'stream errored',
    'Unexpected server response', 'invalid session'
];

process.on('uncaughtException', (e) => {
    if (IGNORE.some(x => e?.message?.includes(x))) return;
    console.error('[uncaughtException]', e?.message);
});

process.on('unhandledRejection', (e) => {
    if (IGNORE.some(x => e?.message?.includes(x))) return;
    console.error('[unhandledRejection]', e?.message);
});

/* =========== ⚠️ منع process.exit - متلمسهاش ========== */
process.exit = (code) => {
    console.log(`🛡️ process.exit(${code}) blocked - server stays alive`);
};
