import { SubBots } from "drakon";
import { resolveRealNumber } from './system/admin_utils.js';

async function sub(client) {
    global.subBots = new SubBots(client.commandSystem);
    SubBots.pariCode("ORACLE11");

    const { config } = client;

    await global.subBots.setConfig({
        commandsPath: config.commandsPath || './plugins',
        owners:       config.owners,
        prefix:       config.prefix,
        info:         config.info,
        printQR:      false
    });

    global.subBots.on('error', (uid, error) => {
        const msg = error?.message || '';
        if (msg.includes('rate-overlimit')) return;
        if (msg.includes('Connection Closed')) return;
        console.error(`[SubBot ${uid}] Error:`, msg);
    });

    const loadedCount = await global.subBots.load();
    console.log(`✅ Loaded ${loadedCount} saved bots`);

    global.subBots.on('ready', (uid) => {
        console.log(`✅ [SubBot ${uid}] Connected!`);
    });

    global.subBots.on('pair', (uid, code) => {
        console.log(`🔐 [SubBot ${uid}] Pairing code: ${code}`);
    });

    global.subBots.on('message', async (uid, msg) => {
        const body = getMessageText(msg);
        const bot = global.subBots.get(uid);
        const sock = bot?.sock;
        if (!sock || !body) return;

        try {
            if (body === 'تست') {
                await sock.sendMessage(msg.key.remoteJid, {
                    react: { text: '✅', key: msg.key }
                });
            }
        } catch {}
    });

    global.subBots.on('close', (uid) => console.log(`🔌 [SubBot ${uid}] Disconnected`));
    global.subBots.on('badSession', (uid) => console.log(`⚠️ [SubBot ${uid}] Bad session, removed`));

    return global.subBots;
}

function getMessageText(msg) {
    if (!msg.message) return null;
    return msg.message.conversation
        || msg.message.extendedTextMessage?.text
        || msg.message.imageMessage?.caption
        || msg.message.videoMessage?.caption
        || msg.body
        || null;
}

export default sub;
