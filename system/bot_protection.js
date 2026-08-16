

const allIdsOf = (...vals) => {
    const out = new Set();
    for (const v of vals) {
        if (!v) continue;
        out.add(v);
        const num = v.split('@')[0]?.split(':')[0];
        if (num) {
            out.add(`${num}@s.whatsapp.net`);
            out.add(`${num}@lid`);
            out.add(num);
        }
    }
    return out;
};

const participantMatches = (p, targetIds) => {
    const candidates = allIdsOf(p.id, p.jid, p.lid, p.pn, p.phoneNumber);
    for (const c of candidates) {
        if (targetIds.has(c)) return true;
    }
    return false;
};

const metaCache = new Map();
const metaInFlight = new Map();
const META_TTL_MS = 8_000;

const getGroupMetaCached = async (chat, conn) => {
    const cached = metaCache.get(chat);
    if (cached && (Date.now() - cached.ts) < META_TTL_MS) return cached.meta;

    if (metaInFlight.has(chat)) return metaInFlight.get(chat);

    const promise = (async () => {

        let lastErr;
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const meta = await conn.groupMetadata(chat);
                metaCache.set(chat, { meta, ts: Date.now() });
                return meta;
            } catch (e) {
                lastErr = e;
                if (attempt === 0) await new Promise(r => setTimeout(r, 700));
            }
        }
        throw lastErr;
    })();

    metaInFlight.set(chat, promise);
    try {
        return await promise;
    } finally {
        metaInFlight.delete(chat);
    }
};

export const isBotActualAdmin = async (chat, conn) => {
    const meta = await getGroupMetaCached(chat, conn);
    if (!meta?.participants) throw new Error('no participants in metadata');

    const botIds = allIdsOf(
        conn?.user?.id,
        conn?.user?.lid,
        conn?.user?.jid,
        conn?.user?.pn
    );

    const botParticipant = meta.participants.find(p => participantMatches(p, botIds));

    if (process.env.DEBUG_ADMIN_CHECK === '1') {
        console.log('[isBotActualAdmin] botIds:', [...botIds]);
        console.log('[isBotActualAdmin] conn.user:', conn?.user);
        console.log('[isBotActualAdmin] matched participant:', botParticipant);
    }

    return botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
};

export const isUserActualAdmin = async (sender, chat, conn) => {
    const meta = await getGroupMetaCached(chat, conn);
    if (!meta?.participants) throw new Error('no participants in metadata');

    const senderIds = allIdsOf(sender);
    const userParticipant = meta.participants.find(p => participantMatches(p, senderIds));
    return userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin';
};

const KNOWN_BOTS = [
    '6281234567890@s.whatsapp.net',
    '201234567890@s.whatsapp.net',
];

export const isFromKnownBot = (sender) => {
    return KNOWN_BOTS.some(bot =>
        sender === bot ||
        sender.split(':')[0] + '@s.whatsapp.net' === bot
    );
};

export const checkCommandCooldown = (_cmd, _sender, _chat) => {
    return { allowed: true, waitMs: 0 };
};

export const adminGuard = async (m, { conn, bot }) => {

    if (isFromKnownBot(m.sender)) return false;

    const originalBotAdmin  = m.isBotAdmin;
    const originalUserAdmin = m.isAdmin;

    try {
        const liveBotAdmin  = await isBotActualAdmin(m.chat, conn);
        const liveUserAdmin = await isUserActualAdmin(m.sender, m.chat, conn);

        m.isBotAdmin = liveBotAdmin || (originalBotAdmin ?? false);
        m.isAdmin = liveUserAdmin || (originalUserAdmin ?? false);
    } catch {

        m.isBotAdmin  = originalBotAdmin;
        m.isUserAdmin = originalUserAdmin;
    }

    return false;
};

export const notAdminMsg = () =>
    '*「💥」 ارفـعـني مـشـرف يـسـطـا وبـعـدين نـفـز الامـر*';

export const notAuthMsg = () =>
    '*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*';
