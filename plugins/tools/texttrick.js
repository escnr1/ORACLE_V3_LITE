/*
 * 𝐎𝐑𝐀𝐂𝐋𝐄 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@oracle_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@oracle_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

function مربعات_سوداء(نص) {
    const خريطة = {
        a:'🅐',b:'🅑',c:'🅒',d:'🅓',e:'🅔',f:'🅕',g:'🅖',h:'🅗',i:'🅘',j:'🅙',
        k:'🅚',l:'🅛',m:'🅜',n:'🅝',o:'🅞',p:'🅟',q:'🅠',r:'🅡',s:'🅢',t:'🅣',
        u:'🅤',v:'🅥',w:'🅦',x:'🅧',y:'🅨',z:'🅩',' ':' '
    };
    return [...نص.toLowerCase()].map(c => خريطة[c] || c).join('');
}

function حروف_صغيرة(نص) {
    const خريطة = {
        a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',
        k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'Q',r:'ʀ',s:'ꜱ',t:'ᴛ',
        u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'
    };
    return [...نص.toLowerCase()].map(c => خريطة[c] || c).join('');
}

function مرآة(نص) {
    const خريطة = {
        a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',
        k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',
        u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',' ':' '
    };
    return [...نص.toLowerCase()].map(c => خريطة[c] || c).reverse().join('');
}

function سايبر(نص) {
    const خريطة = {
        a:'ａ',b:'ｂ',c:'ｃ',d:'ｄ',e:'ｅ',f:'ｆ',g:'ｇ',h:'ｈ',i:'ｉ',j:'ｊ',
        k:'ｋ',l:'ｌ',m:'ｍ',n:'ｎ',o:'ｏ',p:'ｐ',q:'ｑ',r:'ｒ',s:'ｓ',t:'ｔ',
        u:'ｕ',v:'ｖ',w:'ｗ',x:'ｘ',y:'ｙ',z:'ｚ',
        '0':'０','1':'１','2':'２','3':'３','4':'４','5':'５','6':'６','7':'７','8':'８','9':'９',' ':' '
    };
    return [...نص.toLowerCase()].map(c => خريطة[c] || c).join('');
}

function غامض(نص) {
    return [...نص].map(c => c + '\u0336').join('');
}

function مزخرف(نص) {
    const خريطة = {
        a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',
        k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',
        u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',' ':' '
    };
    return [...نص.toLowerCase()].map(c => خريطة[c] || c).join('');
}

function عريض_مائل(نص) {
    const خريطة = {
        a:'𝒂',b:'𝒃',c:'𝒄',d:'𝒅',e:'𝒆',f:'𝒇',g:'𝒈',h:'𝒉',i:'𝒊',j:'𝒋',
        k:'𝒌',l:'𝒍',m:'𝒎',n:'𝒏',o:'𝒐',p:'𝒑',q:'𝒒',r:'𝒓',s:'𝒔',t:'𝒕',
        u:'𝒖',v:'𝒗',w:'𝒘',x:'𝒙',y:'𝒚',z:'𝒛',' ':' '
    };
    return [...نص.toLowerCase()].map(c => خريطة[c] || c).join('');
}

const الأنماط = [
    { اسم: '🔲 مربعات', fn: مربعات_سوداء },
    { اسم: 'ꜱ ᴄᴀᴘꜱ صغيرة', fn: حروف_صغيرة },
    { اسم: '🔄 مرآة', fn: مرآة },
    { اسم: '🖥️ سايبر', fn: سايبر },
    { اسم: '〰️ مشطوب', fn: غامض },
    { اسم: '𝓶 مزخرف', fn: مزخرف },
    { اسم: '𝒃 عريض مائل', fn: عريض_مائل },
];

const handler = async (m, { text, command }) => {
    if (!text) return m.reply(`*✨ تحويل النص لأشكال مختلفة*\n\nمثال: .${command} أهلاً بيك بالعالم`);

    let رد = `*✨ أشكال النص — ${text}*\n${'━'.repeat(30)}\n\n`;
    for (const نمط of الأنماط) {
        رد += `*${نمط.اسم}:*\n${نمط.fn(text)}\n\n`;
    }
    رد += `> *𝐎𝐑𝐀𝐂𝐋𝐄 BOT*`;

    m.reply(رد);
};

handler.usage = ['نص_مزخرف'];
handler.command = ['نص_مزخرف', 'texttrick', 'fancy', 'زخرفة'];
handler.category = 'tools';

export default handler;
