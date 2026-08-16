import { execSync } from "child_process";

const handler = async (m, { bot }) => {
    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');
    try {
        m.react("🧹");
        m.reply("*🧹╎ استنى بس، بنضف...*");
        const result = execSync(
            'files=$(ls session/pre-key-* session/device-list-* 2>/dev/null | wc -l); rm -rf session/pre-key-* session/device-list-* 2>/dev/null; echo "$files"',
            { encoding: 'utf-8' }
        );
        const count = parseInt(result.trim()) || 0;
        m.react("🟢");
        await m.reply(`*🗑️╎ اتنضف [ ${count} ] ملف*`);
    } catch (error) {
        await m.reply(`\`\`\`${error.message}\`\`\``);
    }
};

handler.command = ["تنظيف"];
handler.category = "owner";
handler.usage = ["تنظيف"];
handler.owner = false;

export default handler;
