import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, bot, text, command, args }) => {
    try {
        if (!m.isOwner) return m.reply('❌ الأمر ده للمطور بس.');

        const base = bot.config?.commandsPath || './plugins';

        // ── عرض قائمة الملفات ──
        if (!text || text.trim() === 'list') {
            const allFiles = [];
            const walk = (dir) => {
                for (const item of fs.readdirSync(dir)) {
                    const p = path.join(dir, item);
                    if (fs.statSync(p).isDirectory()) walk(p);
                    else if (item.endsWith('.js')) allFiles.push(path.relative(base, p));
                }
            };
            walk(base);

            return m.reply(
`╮••─๋︩︪──๋︩︪─═⊐‹📂›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *ملفات البوت المتاحة*
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
${allFiles.map((f, i) => `> │┊ ۬.͜ـ📄˖ ⟨${i + 1}. ${f}☇`).join('\n')}
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ
> *طريقة التعديل:*
> .${command} اسم_الملف | الكود الجديد`.trim()
            );
        }

        // ── قراءة ملف ──
        if (text.startsWith('read ')) {
            const targetName = text.slice(5).trim().replace(/\.js$/, '');
            const filePath = findFile(base, targetName);
            if (!filePath) return m.reply(`❌ مش لاقي الملف: ${targetName}.js`);

            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');

            return m.reply(
`╮••─๋︩︪──๋︩︪─═⊐‹📄›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *${path.relative(base, filePath)}* — ${lines.length} سطر
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
\`\`\`javascript
${content.slice(0, 3000)}${content.length > 3000 ? '\n... (باقي الكود أطول)' : ''}
\`\`\`
╯─ׅ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ`.trim()
            );
        }

        // ── استرجاع نسخة احتياطية ──
        if (text.startsWith('restore ')) {
            const targetName = text.slice(8).trim().replace(/\.js$/, '');
            const backupDir = path.join(process.cwd(), 'backups');

            if (!fs.existsSync(backupDir)) return m.reply('❌ مفيش نسخ احتياطية.');

            const backups = fs.readdirSync(backupDir)
                .filter(f => f.startsWith(targetName + '_') && f.endsWith('.js.bak'))
                .sort()
                .reverse();

            if (!backups.length) return m.reply(`❌ مفيش نسخة احتياطية للملف: ${targetName}`);

            const latestBackup = path.join(backupDir, backups[0]);
            const filePath = findFile(base, targetName);
            if (!filePath) return m.reply(`❌ مش لاقي الملف الأصلي: ${targetName}.js`);

            fs.copyFileSync(latestBackup, filePath);
            return m.reply(
`╮••─๋︩︪──๋︩︪─═⊐‹✅›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *الاسترجاع تمام*
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ📄˖ ⟨الملف: ${targetName}.js☇
> │┊ ۬.͜ـ⚡˖ ⟨اعمل .restart عشان التغييرات تتطبق☇
╯─ׅ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ`.trim()
            );
        }

        // ── تعديل الملف ──
        const sepIndex = text.indexOf('|');
        if (sepIndex === -1) return m.reply(
`╮••─๋︩︪──๋︩︪─═⊐‹🕸›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *طريقة الاستخدام*
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ✏️˖ ⟨تعديل: .${command} اسم_الملف | الكود☇
> │┊ ۬.͜ـ📂˖ ⟨قائمة: .${command} list☇
> │┊ ۬.͜ـ📄˖ ⟨قراءة: .${command} read اسم_الملف☇
> │┊ ۬.͜ـ♻️˖ ⟨استرجاع: .${command} restore اسم_الملف☇
╯─ׅ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ`.trim()
        );

        const targetName = text.slice(0, sepIndex).trim().replace(/\.js$/, '');
        const newCode = text.slice(sepIndex + 1).trim();

        if (!targetName) return m.reply('❌ حط اسم الملف قبل الـ |');
        if (!newCode) return m.reply('❌ حط الكود الجديد بعد الـ |');

        const filePath = findFile(base, targetName);
        if (!filePath) return m.reply(`❌ مش لاقي الملف: ${targetName}.js`);

        // نسخة احتياطية
        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const oldContent = fs.readFileSync(filePath, 'utf-8');
        const backupPath = path.join(backupDir, `${targetName}_${Date.now()}.js.bak`);
        fs.writeFileSync(backupPath, oldContent, 'utf-8');

        fs.writeFileSync(filePath, newCode, 'utf-8');

        const relativePath = path.relative(base, filePath);

        return m.reply(
`╮••─๋︩︪──๋︩︪─═⊐‹✅›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *الملف اتعدّل تمام*
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ📄˖ ⟨الملف: ${relativePath}☇
> │┊ ۬.͜ـ📦˖ ⟨نسخة احتياطية اتحفظت☇
> │┊ ۬.͜ـ⚡˖ ⟨اعمل .restart عشان التغييرات تتطبق☇
╯─ׅ─๋︩︪─═⊐‹𝐎𝐑𝐀𝐂𝐋𝐄 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ`.trim()
        );

    } catch (error) {
        return m.reply(`❌ خطأ:\n\`\`\`${error.message}\`\`\``);
    }
};

const findFile = (base, name) => {
    const search = (dir) => {
        if (!fs.existsSync(dir)) return null;
        for (const item of fs.readdirSync(dir)) {
            const p = path.join(dir, item);
            if (fs.statSync(p).isDirectory()) {
                const found = search(p);
                if (found) return found;
            } else if (item === `${name}.js`) {
                return p;
            }
        }
        return null;
    };
    return search(base);
};

handler.category = 'owner';
handler.usage = ['editcode'];
handler.command = ['editcode', 'تعديل_كود'];
handler.owner = true;

export default handler;