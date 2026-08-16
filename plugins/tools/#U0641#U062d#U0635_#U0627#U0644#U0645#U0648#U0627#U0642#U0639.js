import dns from 'dns/promises';
import axios from 'axios';

const cleanDomain = (input) => {
    let d = (input || '').trim();
    d = d.replace(/^https?:\/\//, '').split('/')[0];
    return d;
};

const handler = async (m, { conn, command, text }) => {
    const domain = cleanDomain(text);
    if (!domain) return m.reply(`*⚠️ اكتب اسم الدومين*\n> مثال: \`${command} google.com\``);

    if (command === 'دي_ان_اس') {
        try {
            const records = await dns.resolve4(domain).catch(() => []);
            const records6 = await dns.resolve6(domain).catch(() => []);
            const mx = await dns.resolveMx(domain).catch(() => []);
            const ns = await dns.resolveNs(domain).catch(() => []);

            if (records.length === 0 && records6.length === 0) {
                return m.reply('*❌ الدومين ده مش موجود أو مالوش سجلات DNS*');
            }

            let txt = `╭─┈─┈─⟞🌐⟝─┈─┈─╮\n┃ *DNS: ${domain}*\n╰─┈─┈─⟞📡⟝─┈─┈─╯\n\n`;
            if (records.length) txt += `📍 A: ${records.join(', ')}\n`;
            if (records6.length) txt += `📍 AAAA: ${records6.join(', ')}\n`;
            if (ns.length) txt += `🗂️ NS: ${ns.join(', ')}\n`;
            if (mx.length) txt += `📧 MX: ${mx.map(x => x.exchange).join(', ')}\n`;

            return conn.sendMessage(m.chat, { text: txt }, { quoted: m });
        } catch {
            return m.reply('*❌ حصلت مشكلة في البحث عن الدومين*');
        }
    }

    if (command === 'فحص_الموقع') {
        try {
            const start = Date.now();
            const res = await axios.get(`https://${domain}`, { timeout: 10000, validateStatus: () => true });
            const time = Date.now() - start;
            return conn.sendMessage(m.chat, {
                text:
                    `╭─┈─┈─⟞🌐⟝─┈─┈─╮\n┃ *فحص الموقع: ${domain}*\n╰─┈─┈─⟞✅⟝─┈─┈─╯\n\n` +
                    `┃ 📶 الحالة: ${res.status < 400 ? 'شغال ✅' : `في مشكلة (${res.status}) ⚠️`}\n` +
                    `┃ ⏱️ زمن الاستجابة: ${time} ms`
            }, { quoted: m });
        } catch {
            return m.reply('*❌ الموقع مش راد أو مش موجود*');
        }
    }
};

handler.usage    = ['دي_ان_اس', 'فحص_الموقع'];
handler.category = 'tools';
handler.command  = ['دي_ان_اس', 'فحص_الموقع'];
handler.cooldown = 3000;

export default handler;
