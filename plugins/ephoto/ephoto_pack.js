// ════════════════════════════════════════
//  قسم "تأثيرات النصوص" (ephoto) - 10 أوامر
//  كل التأثيرات محلية بخرائط يونيكود، بدون أي API خارجي
//  ORACLE
// ════════════════════════════════════════

const MAPS = {
    bubble: { src: 'abcdefghijklmnopqrstuvwxyz0123456789',
              dst: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨' },
    bold:   { src: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
              dst: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵' },
    small:  { src: 'abcdefghijklmnopqrstuvwxyz',
              dst: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ' },
    square: { src: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
              dst: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉' },
    gothic: { src: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
              dst: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ' },
    italic: { src: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
              dst: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡' }
};

const convert = (text, mapName) => {
    const { src, dst } = MAPS[mapName];
    const chars = [...dst];
    return text.split('').map(c => {
        const i = src.indexOf(c.toLowerCase());
        return i === -1 ? c : chars[i];
    }).join('');
};

const handler = async (m, { command, text }) => {
    const t = (text || '').trim();
    const needText = () => m.reply('*⚠️ اكتب نص إنجليزي بعد الأمر يا فنان*');

    switch (command) {
        case 'نص_فقاعي': {
            if (!t) return needText();
            return m.reply(`🔵 *النص الفقاعي:*\n${convert(t, 'bubble')}`);
        }
        case 'نص_غامق': {
            if (!t) return needText();
            return m.reply(`💪 *النص الغامق:*\n${convert(t, 'bold')}`);
        }
        case 'نص_صغير': {
            if (!t) return needText();
            return m.reply(`🔻 *النص الصغير:*\n${convert(t, 'small')}`);
        }
        case 'نص_مربع': {
            if (!t) return needText();
            return m.reply(`◻️ *النص المربع:*\n${convert(t, 'square')}`);
        }
        case 'نص_قوطي': {
            if (!t) return needText();
            return m.reply(`🏰 *النص القوطي:*\n${convert(t, 'gothic')}`);
        }
        case 'نص_مائل': {
            if (!t) return needText();
            return m.reply(`📐 *النص المائل:*\n${convert(t, 'italic')}`);
        }
        case 'نص_مسافات': {
            if (!t) return needText();
            return m.reply(`↔️ *النص متباعد:*\n${t.split('').join(' ')}`);
        }
        case 'نص_مقلوب': {
            if (!t) return needText();
            const flipMap = { a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'ʅ',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z' };
            const flipped = t.toLowerCase().split('').reverse().map(c => flipMap[c] || c).join('');
            return m.reply(`🙃 *النص المقلوب:*\n${flipped}`);
        }
        case 'نص_زخرفي': {
            if (!t) return needText();
            return m.reply(`✨ *نص مزخرف:*\n乂 ${t} 乂\n『${t}』\n『⃟${t}⃟』`);
        }
        case 'نص_دائري': {
            if (!t) return needText();
            return m.reply(`⭕ *نص محاط:*\n(´｡• ${t} •｡\`)\n【${t}】`);
        }
    }
};

handler.usage = [
    'نص_فقاعي <نص>','نص_غامق <نص>','نص_صغير <نص>','نص_مربع <نص>','نص_قوطي <نص>',
    'نص_مائل <نص>','نص_مسافات <نص>','نص_مقلوب <نص>','نص_زخرفي <نص>','نص_دائري <نص>'
];
handler.category = 'ephoto';
handler.command  = [
    'نص_فقاعي','نص_غامق','نص_صغير','نص_مربع','نص_قوطي',
    'نص_مائل','نص_مسافات','نص_مقلوب','نص_زخرفي','نص_دائري'
];

export default handler;
