import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'system', 'database.json');
const BACKUP_DIR = path.join(__dirname, '..', '..', 'system', 'backups');

const isOwner = (m, bot) => bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);

const handler = async (m, { conn, command, text, bot }) => {
    if (!isOwner(m, bot)) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');

    if (command === 'نسخة_احتياطية') {
        try {
            if (!fs.existsSync(DB_PATH)) return m.reply('*❌ ملف قاعدة البيانات مش موجود*');
            if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(BACKUP_DIR, `backup-${stamp}.json`);
            fs.copyFileSync(DB_PATH, backupPath);

            return conn.sendMessage(m.chat, {
                document: fs.readFileSync(backupPath),
                fileName: `backup-${stamp}.json`,
                mimetype: 'application/json'
            }, { quoted: m });
        } catch (e) {
            return m.reply('*❌ حصلت مشكلة أثناء عمل النسخة الاحتياطية*');
        }
    }

    if (command === 'قائمة_النسخ') {
        try {
            if (!fs.existsSync(BACKUP_DIR)) return m.reply('*📭 مفيش نسخ احتياطية لسه*');
            const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort().reverse().slice(0, 15);
            if (files.length === 0) return m.reply('*📭 مفيش نسخ احتياطية لسه*');
            return conn.sendMessage(m.chat, {
                text: `╭─┈─┈─⟞💾⟝─┈─┈─╮\n┃ *آخر النسخ الاحتياطية*\n╰─┈─┈─⟞📋⟝─┈─┈─╯\n\n${files.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
            }, { quoted: m });
        } catch {
            return m.reply('*❌ حصلت مشكلة في قراءة النسخ*');
        }
    }
    if (command === 'تصفير_قاعدة_البيانات') {
        const confirm = text?.trim();
        if (confirm !== 'تأكيد الحذف') {
            return m.reply('*⚠️ ده هيمسح كل بيانات المستخدمين والجروبات نهائيًا!*\n> لو متأكد اكتب:\n`تصفير_قاعدة_البيانات تأكيد الحذف`\n\n> *ينصح تعمل `نسخة_احتياطية` الأول*');
        }
        try {
            if (fs.existsSync(DB_PATH)) {
                // ناخد نسخة احتياطية تلقائية قبل المسح
                if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
                const stamp = new Date().toISOString().replace(/[:.]/g, '-');
                fs.copyFileSync(DB_PATH, path.join(BACKUP_DIR, `before-reset-${stamp}.json`));
            }
            fs.writeFileSync(DB_PATH, JSON.stringify({ groups: {}, users: {}, extraOwners: [] }, null, 2));
            return m.reply('*✅ اتصفرت قاعدة البيانات، واتاخدت نسخة احتياطية قبلها للأمان*');
        } catch {
            return m.reply('*❌ حصلت مشكلة أثناء التصفير*');
        }
    }
};

handler.usage    = ['نسخة_احتياطية', 'قائمة_النسخ', 'تصفير_قاعدة_البيانات'];
handler.category = 'owner';
handler.command  = ['نسخة_احتياطية', 'قائمة_النسخ', 'تصفير_قاعدة_البيانات'];
handler.owner    = true;
handler.cooldown = 5000;

export default handler;
