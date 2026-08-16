

const RATE_LIMITED_METHODS = [
    'sendMessage',
    'groupParticipantsUpdate',
    'groupMetadata',
    'groupSettingUpdate',
    'groupInviteCode',
    'groupRevokeInvite',
    'groupUpdateSubject',
    'groupUpdateDescription',
    'updateProfileStatus',
    'onWhatsApp',
    'profilePictureUrl',
];

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;
const MIN_GAP_MS = 250;

const isRateLimitError = (e) => {
    const msg = (e?.message || e?.data || String(e) || '').toLowerCase();
    return msg.includes('rate-overlimit') || msg.includes('rate overlimit');
};

export const wrapConnWithRateSafety = (conn) => {
    if (!conn || conn.__rateSafeWrapped) return conn;
    conn.__rateSafeWrapped = true;
    conn.__lastCallAt = 0;

    const throttle = async () => {
        const wait = conn.__lastCallAt + MIN_GAP_MS - Date.now();
        if (wait > 0) await new Promise(r => setTimeout(r, wait));
        conn.__lastCallAt = Date.now();
    };

    for (const methodName of RATE_LIMITED_METHODS) {
        const original = conn[methodName];
        if (typeof original !== 'function') continue;

        conn[methodName] = async function (...args) {
            await throttle();

            let lastErr;
            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    return await original.apply(this, args);
                } catch (e) {
                    lastErr = e;
                    if (!isRateLimitError(e)) throw e;

                    const delay = BASE_DELAY_MS * Math.pow(2, attempt);
                    console.error(`[rate-safety] ${methodName} اتضرب rate-overlimit، استنى ${delay}ms (محاولة ${attempt + 1}/${MAX_RETRIES})`);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
            throw lastErr;
        };
    }

    return conn;
};
