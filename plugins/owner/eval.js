import { createRequire } from 'module';
import { format } from 'util';

class CustomArray extends Array {
  constructor(...args) {
    if (args.length === 1 && typeof args[0] === 'number') {
      super(Math.min(args[0], 10000));
    } else {
      super(...args);
    }
  }
}

const handler = async (m, { bot, conn }) => {
    const body = m.text || '';
    const codeText = body.replace(/^(>|=>)\s*/, '').trim();

    if (!codeText) return m.reply('مثال: => m');

    try {
        const require = createRequire(import.meta.url);
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        const vars = {
            conn,
            bot,
            m,
            reply: m.reply.bind(m),
            print: (...args) => m.reply(format(...args)),
            require,
            process,
            Array: CustomArray
        };

        let processedCode = body.startsWith('=>') ? `return (${codeText})` : codeText;

        const executeCode = new AsyncFunction(...Object.keys(vars), processedCode);
        let result = await executeCode(...Object.values(vars));

        if (result !== undefined) {
            await m.reply(format(result));
        }
    } catch (err) {
        await m.reply(`${err.message || err.stack || err}`);
    }
};

handler.description = "كود لتجربة أي كود تاني";
handler.category = "owner";
handler.usage = [">", "=>"];
handler.usePrefix = false;
handler.owner = true;
handler.command = [">", "=>"];

export default handler;
