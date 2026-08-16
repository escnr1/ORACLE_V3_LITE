const test = async (m, { conn, bot }) => {
    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner) return m.reply('*❌ الأمر ده للمطورين بس يا صاحبي*');

    m.react("🟢");
    conn.msgUrl(m.chat, "♡゙ Bot is restarting...", {
        title: "𝘖𝘙𝘈𝘊𝘓𝘌 𝘪𝘴 𝘢 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 𝘣𝘰𝘵 𝘧𝘳𝘰𝘮 𝘵𝘩𝘦 𝘌𝘚𝘊𝘓𝘐𝘕𝘒 𝘓𝘪𝘣𝘳𝘢𝘳𝘺",
        body: "𝑇𝒉𝑒 𝑏𝑜𝑡 𝑖𝑠 𝑠𝑖𝑚𝑝𝑙𝑒 𝑡𝑜 𝑚𝑜𝑑𝑖𝑓𝑦",
        img: "https://i.postimg.cc/XJX2cRJc/0af18dd2b2543651464204773234c433.jpg",
        big: false
    });
    setTimeout(() => { bot.restart(); }, 1000);
};

test.usage    = ['رستارت'];
test.category = 'owner';
test.command  = ['رستارت', 'restart'];
test.owner    = true; // ✅ مش يشتغل إلا مع الـ owner

export default test;
