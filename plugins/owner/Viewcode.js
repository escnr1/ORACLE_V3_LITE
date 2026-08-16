import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, bot, text, command }) => {
    try {
        if (!m.isOwner) return m.reply('❌ الأمر ده للمطور بس.');

        if (!text) return m.reply(
`_🕸 طريقه الاستخدام_ — *.${command} اسم_الملف*
> مثال : .${command} menu`
        );

        const base = bot.config?.commandsPath || './plugins';
        const targetName = text.trim().replace(/\.js$/, '');

        const findFile = (name) => {
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

        const filePath = findFile(targetName);

        if (!filePath || !fs.existsSync(filePath)) {
            return m.reply(`❌ مفيش ملف اسمه: ${targetName}.js`);
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(base, filePath);

        return await conn.sendAiMessage(m.chat, [
            {
                type: 2,
                text: `📄 مسار الملف : \`${relativePath}\``,
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 1
                }
            },
            {
                type: 5,
                codeMetadata: {
                    language: "javascript",
                    code: fileContent
                },
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 1
                }
            }
        ]);

    } catch (error) {
        return m.reply("❌ " + error.message);
    }
};

handler.category = 'owner';
handler.usage = ["كود"];
handler.command = ['كود', 'getcode', 'cat'];
handler.owner = true;

export default handler;
