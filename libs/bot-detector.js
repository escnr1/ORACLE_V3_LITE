/**
 * 🤖 مكتبة كشف البوتات الغير مصرح بها
 * ORACLE v3.0 - كشف بقايمة بوتات معروفة (مش تخمين)
 *
 * ملحوظة مهمة: الإصدار القديم كان بيحاول "يخمّن" إن أي حد آيدي بتاعه
 * فيه ":" (جهاز مرتبط) يبقى بوت. ده كان غلط تمامًا لأن أي إنسان عادي
 * فاتح واتساب من الكمبيوتر أو تابلت بيبقى آيدي بتاعه بالشكل ده كمان،
 * فكان بيتهم ناس حقيقية بالغلط. دلوقتي البوت بيعتمد بس على قايمة
 * بوتات إنت مضيفها بنفسك (أرقام معروفة)، مفيش تخمين خالص.
 *
 * الاستخدام في index.js:
 *   import BotDetector from './libs/bot-detector.js';
 *   const detector = new BotDetector(client, {
 *       ownerJid: '201092178171@s.whatsapp.net',
 *       autoWarn: true,
 *       antiBotMode: false,
 *   });
 *   detector.start();
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const KNOWN_BOTS_FILE = './system/known_bots.json';

class BotDetector {
    constructor(client, options = {}) {
        this.client       = client;
        this.ownerJid     = options.ownerJid     || null;
        this.autoKick     = options.autoKick     ?? false;
        this.autoWarn     = options.autoWarn     ?? true;
        this.antiBotMode  = options.antiBotMode  ?? false;
        this.sessionPaths = options.sessionPaths || ['./sessions', './auth_info', './auth'];
        this.myBots       = new Set();   // بوتاتي أنا (مايتطردوش أبدًا)
        this.knownBots    = new Set();   // بوتات تانية معروفة (دي اللي بتتطرد)
        this.warned       = new Map();
        this._started     = false;

        this.loadKnownBots();
    }

    // ══ قايمة البوتات الغريبة المعروفة (بتتحفظ في ملف عشان تفضل بعد الريستارت) ══
    loadKnownBots() {
        try {
            if (existsSync(KNOWN_BOTS_FILE)) {
                const data = JSON.parse(readFileSync(KNOWN_BOTS_FILE, 'utf-8'));
                this.knownBots = new Set(data.bots || []);
            }
        } catch { this.knownBots = new Set(); }
    }

    saveKnownBots() {
        try {
            writeFileSync(KNOWN_BOTS_FILE, JSON.stringify({ bots: [...this.knownBots] }, null, 2));
        } catch (e) { console.error('[BotDetector] فشل حفظ قايمة البوتات:', e.message); }
    }

    addKnownBot(jid) {
        const num = jid.split('@')[0].split(':')[0];
        this.knownBots.add(num + '@s.whatsapp.net');
        this.saveKnownBots();
        console.log(`[BotDetector] ➕ اتضاف بوت للقايمة: +${num}`);
        return num;
    }

    removeKnownBot(jid) {
        const num = jid.split('@')[0].split(':')[0];
        const removed = this.knownBots.delete(num + '@s.whatsapp.net');
        if (removed) this.saveKnownBots();
        return removed;
    }

    listKnownBots() {
        return [...this.knownBots];
    }

    // تحميل بوتاتي من ملفات الجلسات (دول أصلاً مايتفحصوش)
    loadMyBots() {
        this.myBots.clear();
        for (const dir of this.sessionPaths) {
            if (!existsSync(dir)) continue;
            try {
                for (const item of readdirSync(dir)) {
                    if (/^\d{7,15}$/.test(item)) {
                        this.myBots.add(item + '@s.whatsapp.net');
                    }
                    const creds = join(dir, item, 'creds.json');
                    if (existsSync(creds)) {
                        try {
                            const data = JSON.parse(readFileSync(creds, 'utf-8'));
                            const phone = data?.me?.id?.split(':')[0]?.split('@')[0];
                            if (phone) this.myBots.add(phone + '@s.whatsapp.net');
                        } catch {}
                    }
                }
            } catch {}
        }
        try {
            const subList = global.subBots?.list?.() || [];
            for (const b of subList) if (b.phone) this.myBots.add(b.phone + '@s.whatsapp.net');
        } catch {}
        console.log(`[BotDetector] بوتاتي المعروفة: ${this.myBots.size} | بوتات غريبة مسجلة: ${this.knownBots.size}`);
    }

    // ══ الكشف الحقيقي: هل الرقم ده موجود في قايمة البوتات المعروفة؟ ══
    // (مش تخمين من شكل الآيدي - ده كان سبب المشكلة الأساسي)
    isBot(jid) {
        const num = jid?.split('@')[0]?.split(':')[0];
        return this.knownBots.has(num + '@s.whatsapp.net');
    }

    isMyBot(jid) {
        const num = jid?.split('@')[0]?.split(':')[0];
        return this.myBots.has(num + '@s.whatsapp.net') || this.myBots.has(jid);
    }

    isOwner(jid) {
        const owners = this.client?.config?.owners || [];
        return owners.some(o => o.jid === jid || o.lid === jid);
    }

    async isAdmin(sock, chatJid, userJid) {
        try {
            const meta = await sock.groupMetadata(chatJid);
            const num = userJid.split('@')[0].split(':')[0];
            return meta.participants.some(p => {
                const pNum = (p.id || '').split('@')[0].split(':')[0];
                return pNum === num && (p.admin === 'admin' || p.admin === 'superadmin');
            });
        } catch { return false; }
    }

    // إرسال تقرير للمطور
    async sendReport(sock, chatJid, botJid, groupName) {
        if (!this.ownerJid) return;
        const phone = botJid.split('@')[0].split(':')[0];
        try {
            await sock.sendMessage(this.ownerJid, {
                text:
                    `🤖 *بوت غريب لاقيناه شغال*\n\n` +
                    `📱 الرقم: *+${phone}*\n` +
                    `💬 الجروب: *${groupName}*\n` +
                    `🆔 JID: \`${botJid}\`\n\n` +
                    `*عايز تطرده بإيدك؟*\n` +
                    `\`.kick_reported ${chatJid} ${botJid}\`\n\n` +
                    `*عايز تنذره بإيدك؟*\n` +
                    `\`.warn_reported ${chatJid} ${botJid}\``
            });
        } catch (e) { console.error('[BotDetector] فشل التقرير:', e.message); }
    }

    // معالجة البوت المكتشف
    async handleBot(sock, chatJid, botJid, groupName) {
        const phone = botJid.split('@')[0].split(':')[0];

        if (this.antiBotMode || this.autoKick) {
            try {
                await sock.sendMessage(chatJid, {
                    text: `🤖 *بوت مش مصرح له - هطرده على طول!*\n🚫 +${phone}`,
                    mentions: [botJid]
                });
                await sock.groupParticipantsUpdate(chatJid, [botJid], 'remove');
                console.log(`[BotDetector] ✅ تم طرد: +${phone}`);
            } catch (e) { console.error('[BotDetector] فشل الطرد:', e.message); }
            await this.sendReport(sock, chatJid, botJid, groupName);
            return;
        }

        if (this.autoWarn) {
            const warns = (this.warned.get(botJid) || 0) + 1;
            this.warned.set(botJid, warns);

            if (warns >= 3) {
                this.warned.delete(botJid);
                try {
                    await sock.groupParticipantsUpdate(chatJid, [botJid], 'remove');
                    await sock.sendMessage(chatJid, {
                        text: `⛔ اتطرد البوت +${phone} بعد 3 إنذارات`,
                        mentions: [botJid]
                    });
                } catch {}
            } else {
                try {
                    await sock.sendMessage(chatJid, {
                        text: `⚠️ إنذار ${warns}/3 للبوت +${phone}\nإنذار تالت = طرد على طول`,
                        mentions: [botJid]
                    });
                } catch {}
            }
        }

        await this.sendReport(sock, chatJid, botJid, groupName);
    }

    start() {
        if (this._started) return;
        this._started = true;

        this.loadMyBots();
        setInterval(() => this.loadMyBots(), 300_000);

        const attachHooks = (sock) => {
            if (!sock) return;

            sock.ev?.on?.('messages.upsert', async ({ messages, type }) => {
                if (type !== 'notify') return;
                if (!this.knownBots.size) return; // مفيش بوتات مسجلة = مفيش فحص، توفير موارد
                for (const msg of messages) {
                    if (!msg.key?.remoteJid?.endsWith('@g.us')) continue;
                    const sender = msg.key?.participant || msg.participant;
                    if (!sender || !this.isBot(sender)) continue;
                    if (this.isMyBot(sender) || this.isOwner(sender)) continue;

                    const adminChk = await this.isAdmin(sock, msg.key.remoteJid, sender);
                    if (adminChk) continue;

                    let groupName = msg.key.remoteJid;
                    try { groupName = (await sock.groupMetadata(msg.key.remoteJid)).subject; } catch {}

                    console.log(`[BotDetector] 🤖 بوت معروف نشط: +${sender.split('@')[0].split(':')[0]} في ${groupName}`);
                    await this.handleBot(sock, msg.key.remoteJid, sender, groupName);
                }
            });

            sock.ev?.on?.('group-participants.update', async (update) => {
                if (update.action !== 'add') return;
                if (!this.knownBots.size) return;
                for (const participant of update.participants) {
                    if (!this.isBot(participant)) continue;
                    if (this.isMyBot(participant) || this.isOwner(participant)) continue;

                    let groupName = update.id;
                    try { groupName = (await sock.groupMetadata(update.id)).subject; } catch {}

                    console.log(`[BotDetector] 🤖 بوت معروف انضم: +${participant.split('@')[0].split(':')[0]} في ${groupName}`);
                    await this.handleBot(sock, update.id, participant, groupName);
                }
            });

            console.log('[BotDetector] ✅ Hooks مربوطة');
        };

        if (this.client.sock) attachHooks(this.client.sock);
        this.client.on?.('socket', attachHooks);

        const checkSock = setInterval(() => {
            if (this.client.sock && !this.client.sock._bd_hooked) {
                this.client.sock._bd_hooked = true;
                attachHooks(this.client.sock);
            }
        }, 10_000);

        console.log('[BotDetector] 🛡️ مكتبة الكشف تعمل (بقايمة بوتات معروفة بس - مفيش تخمين)');
    }

    enableAntiBotMode()  { this.antiBotMode = true;  console.log('[BotDetector] ⚡ وضع الحظر الفوري مفعل'); }
    disableAntiBotMode() { this.antiBotMode = false; console.log('[BotDetector] وضع الحظر معطل'); }
}

export default BotDetector;
