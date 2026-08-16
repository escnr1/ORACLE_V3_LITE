import fs from 'fs';
import path from 'path';

const handler = async (m, { bot, command }) => {

    const menuFiles = [
        './plugins/menu2.js'
    ];

    if (command === 'اضافه_قسم') {
        const input = (m.text || '').split(/\s+/).slice(1).join(' ').trim();
        if (!input) {
            return m.reply(
                '📌 *طريقة الاستخدام:*\n' +
                '`.اضافه_قسم الاسم العربي | category_key | إيموجي`\n\n' +
                '*مثال:*\n' +
                '`.اضافه_قسم قسم جديد | mynew | 🌟`'
            );
        }

        const parts = input.split('|').map(p => p.trim());
        if (parts.length !== 3) return m.reply('❌ لازم تكتب 3 قيم مفصولة بـ |');

        const [nameAr, key, emoji] = parts;

        if (!nameAr || !key || !emoji) return m.reply('❌ اتأكد إنك كتبت الاسم والـ key والإيموجي');
        if (/\s/.test(key)) return m.reply('❌ الـ key لازم يكون بدون مسافات');

        const results = [];

        for (const menuFile of menuFiles) {
            if (!fs.existsSync(menuFile)) {
                results.push(`❌ مش موجود: \`${menuFile}\``);
                continue;
            }

            let content = fs.readFileSync(menuFile, 'utf8');

            if (content.includes(`'${key}'`) || content.includes(`"${key}"`)) {
                results.push(`⚠️ القسم موجود بالفعل في: \`${path.basename(menuFile)}\``);
                continue;
            }

            // structure جديدة بدون رقم: [1, 'الاسم', 'key', 'emoji']
            const newLine = `    ['${nameAr}', '${key}', '${emoji}'],`;
            content = content.replace(
                /(\];[\s\n]*const getCat)/,
                `${newLine}\n$1`
            );

            fs.writeFileSync(menuFile, content, 'utf8');
            results.push(`✅ اتعمل في: \`${path.basename(menuFile)}\``);
        }

        // إنشاء فولدر القسم
        const pluginsBase = bot.config?.commandsPath || './plugins';
        const catDir = path.join(pluginsBase, key);
        if (!fs.existsSync(catDir)) {
            fs.mkdirSync(catDir, { recursive: true });
            results.push(`📁 اتعمل \`plugins/${key}/\``);
        }

        return m.reply(
            `*نتيجة إضافة القسم:*\n` +
            `├─ الاسم: ${nameAr}\n` +
            `├─ الـ key: ${key}\n` +
            `├─ الإيموجي: ${emoji}\n` +
            `└─ ${results.join('\n└─ ')}`
        );
    }

    else if (command === 'تعديل_قسم') {
        const input = (m.text || '').split(/\s+/).slice(1).join(' ').trim();
        if (!input) {
            return m.reply(
                '📌 *طريقة الاستخدام:*\n' +
                '`.تعديل_قسم key | الحقل | القيمة الجديدة`\n\n' +
                '*الحقول المتاحة:*\n' +
                '`اسم` ← تغيير الاسم العربي\n' +
                '`key` ← تغيير اسم الفولدر\n' +
                '`ايموجي` ← تغيير الإيموجي\n\n' +
                '*مثال:*\n' +
                '`.تعديل_قسم din | اسم | قسم الديـن`\n' +
                '`.تعديل_قسم din | key | religion`\n' +
                '`.تعديل_قسم din | ايموجي | 🕌`'
            );
        }

        const parts = input.split('|').map(p => p.trim());
        if (parts.length !== 3) return m.reply('❌ لازم تكتب 3 قيم: key | الحقل | القيمة');

        const [oldKey, field, newValue] = parts;
        if (!oldKey || !field || !newValue) return m.reply('❌ اتأكد إنك كتبت كل القيم');

        const results = [];

        for (const menuFile of menuFiles) {
            if (!fs.existsSync(menuFile)) {
                results.push(`❌ مش موجود: \`${menuFile}\``);
                continue;
            }

            let content = fs.readFileSync(menuFile, 'utf8');
            const lineRegex = new RegExp(`(\\s*\\[')([^']*)(', '${oldKey}', ')([^']*)('],)`);
            const match = content.match(lineRegex);

            if (!match) {
                results.push(`⚠️ القسم \`${oldKey}\` مش موجود في: \`${path.basename(menuFile)}\``);
                continue;
            }

            let newContent;
            if (field === 'اسم') {
                newContent = content.replace(lineRegex, `$1${newValue}$3$4$5`);
            } else if (field === 'key') {
                if (/\s/.test(newValue)) return m.reply('❌ الـ key لازم يكون بدون مسافات');
                newContent = content.replace(lineRegex, `$1$2', '${newValue}', $4$5`);
            } else if (field === 'ايموجي') {
                newContent = content.replace(lineRegex, `$1$2$3${newValue}$5`);
            } else {
                return m.reply('❌ الحقل غلط\nالحقول المتاحة: `اسم` أو `key` أو `ايموجي`');
            }

            fs.writeFileSync(menuFile, newContent, 'utf8');
            results.push(`✅ اتعمل في: \`${path.basename(menuFile)}\``);
        }

        // لو غير الـ key يغير اسم الفولدر تلقائياً
        if (field === 'key' && results.some(r => r.includes('✅'))) {
            const pluginsBase = bot.config?.commandsPath || './plugins';
            const oldDir = path.join(pluginsBase, oldKey);
            const newDir = path.join(pluginsBase, newValue);
            if (fs.existsSync(oldDir)) {
                fs.renameSync(oldDir, newDir);
                results.push(`📁 الفولدر اتغير من \`${oldKey}\` لـ \`${newValue}\``);
            }
        }

        return m.reply(
            `*نتيجة تعديل القسم \`${oldKey}\`:*\n` +
            `├─ الحقل: ${field}\n` +
            `├─ القيمة الجديدة: ${newValue}\n` +
            `└─ ${results.join('\n└─ ')}`
        );
    }

    else if (command === 'حذف_قسم') {
        const key = (m.text || '').split(/\s+/).slice(1).join('').trim();
        if (!key) return m.reply('📌 *طريقة الاستخدام:*\n`.حذف_قسم category_key`');

        const results = [];

        for (const menuFile of menuFiles) {
            if (!fs.existsSync(menuFile)) {
                results.push(`❌ مش موجود: \`${menuFile}\``);
                continue;
            }

            let content = fs.readFileSync(menuFile, 'utf8');

            if (!content.includes(`'${key}'`) && !content.includes(`"${key}"`)) {
                results.push(`⚠️ القسم مش موجود في: \`${path.basename(menuFile)}\``);
                continue;
            }

            // حذف السطر بدون رقم: [1, 'الاسم', 'key', 'emoji']
            content = content.replace(
                new RegExp(`\\n?\\s*\\['[^']*',\\s*'${key}'[^\\]]*\\],`),
                ''
            );

            fs.writeFileSync(menuFile, content, 'utf8');
            results.push(`🗑️ اتمسح من: \`${path.basename(menuFile)}\``);
        }

        return m.reply(
            `*نتيجة حذف القسم \`${key}\`:*\n` +
            `└─ ${results.join('\n└─ ')}\n\n` +
            `⚠️ الفولدر \`plugins/${key}/\` معتش اتمسح لوحده`
        );
    }
};

handler.usage = ['اضافه_قسم', 'حذف_قسم', 'تعديل_قسم'];
handler.category = 'owner';
handler.command = ['اضافه_قسم', 'حذف_قسم', 'تعديل_قسم'];
handler.owner = true;

export default handler;