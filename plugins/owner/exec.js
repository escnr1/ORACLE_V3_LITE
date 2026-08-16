

const handler = async (m, { text }) => {
    if (!text) return m.reply('مثال: npm i axios');
    try {
        m.react("⚡");
        const { execSync } = await import('child_process');
        const result = execSync(text, { encoding: 'utf-8' });
        m.react("🟢");
        await m.reply(result);
    } catch (error) {
        await m.reply(`\`\`\`${error.message}\`\`\``);
    }
};

handler.command = ["$"];
handler.description = "...";
handler.category = "owner";
handler.usage = ["$"];
handler.owner = true;
handler.usePrefix = false;

export default handler;
