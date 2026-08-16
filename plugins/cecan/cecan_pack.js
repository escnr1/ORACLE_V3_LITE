// ════════════════════════════════════════
//  قسم "متفرقات" (cecan) - 10 أوامر
//  ORACLE
// ════════════════════════════════════════

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ANIMALS = ['🦁 أسد','🐺 ذئب','🦊 ثعلب','🐬 دولفين','🦅 صقر','🐢 سلحفاة','🐯 نمر','🦋 فراشة'];
const FOODS = ['🍕 بيتزا','🍔 برجر','🍜 نودلز','🍰 كيك','🥗 سلطة','🍩 دونات','🍿 بوشار'];
const COLORS_MOOD = ['🔴 أحمر - طاقة عالية','🔵 أزرق - هدوء','🟢 أخضر - توازن','🟡 أصفر - سعادة','🟣 بنفسجي - غموض'];
const EMOJIS_MOOD = ['😎','🔥','🥱','🤯','😂','🧠','👑','🫡','🤝','💫'];

const handler = async (m, { command, text }) => {
    const target = text?.trim() || m.pushName || 'إنت';

    switch (command) {
        case 'لو_كنت_حيوان':
            return m.reply(`🐾 *لو كان ${target} حيوان هيبقى:* ${pick(ANIMALS)}`);

        case 'لو_كنت_طبق_اكل':
            return m.reply(`🍽️ *لو كان ${target} طبق أكل هيبقى:* ${pick(FOODS)}`);

        case 'لو_كنت_لون':
            return m.reply(`🎨 *لو كان ${target} لون هيبقى:* ${pick(COLORS_MOOD)}`);

        case 'صفتك_اليوم': {
            const traits = ['نشيط 🔥','هادي 🧊','مبدع 💡','عنيد 😤','طيب 🤍','ذكي 🧠','مرح 😂'];
            return m.reply(`✨ *صفة ${target} النهاردة:* ${pick(traits)}`);
        }

        case 'ايموجي_يمثلك':
            return m.reply(`${pick(EMOJIS_MOOD)} *ده الإيموجي اللي بيمثل ${target} النهاردة*`);

        case 'جملة_اليوم_ليك': {
            const lines = [
                'إنت غير كده مليون مرة، متتقارنش بحد.',
                'يومك هيبقى تمام لو انت قررت كده من بدري.',
                'مفيش حاجة اسمها متأخر، فيه بس وقتك إنت.'
            ];
            return m.reply(`💭 *جملة ليك يا ${target}:*\n${pick(lines)}`);
        }

        case 'مين_اشبه': {
            const compares = ['قائد فريق قوي 👑','فنان مبدع 🎨','عالم بيفكر كتير 🧠','محارب مايستسلمش 🗡️'];
            return m.reply(`🔍 *${target} بيشبه:* ${pick(compares)}`);
        }

        case 'تقييم_اليوم': {
            const score = Math.floor(Math.random() * 5) + 6;
            return m.reply(`⭐ *تقييم يوم ${target}:* ${score}/10\n${'⭐'.repeat(score)}`);
        }

        case 'همة_اليوم': {
            const lvl = Math.floor(Math.random() * 100) + 1;
            return m.reply(`⚡ *همة ${target} النهاردة:* ${lvl}%\n${lvl > 70 ? 'مفيش وقف قدامك 🔥' : 'خد نفسك واستجمع طاقتك 💪'}`);
        }

        case 'رايك_في': {
            if (!text?.trim()) return m.reply('*⚠️ اكتب حاجة عايز رأي فيها*');
            const opinions = ['فكرة حلوة جدًا 👌','محتاجة شوية تعديل بس تمام 🤏','رهيبة، امشي فيها 🔥','مش متأكد، جرب استشير حد كمان 🤔'];
            return m.reply(`🗣️ *رأي السيستم في "${text.trim()}":*\n${pick(opinions)}`);
        }
    }
};

handler.usage = [
    'لو_كنت_حيوان [اسم]','لو_كنت_طبق_اكل [اسم]','لو_كنت_لون [اسم]','صفتك_اليوم [اسم]',
    'ايموجي_يمثلك [اسم]','جملة_اليوم_ليك [اسم]','مين_اشبه [اسم]','تقييم_اليوم [اسم]',
    'همة_اليوم [اسم]','رايك_في <نص>'
];
handler.category = 'cecan';
handler.command  = [
    'لو_كنت_حيوان','لو_كنت_طبق_اكل','لو_كنت_لون','صفتك_اليوم','ايموجي_يمثلك',
    'جملة_اليوم_ليك','مين_اشبه','تقييم_اليوم','همة_اليوم','رايك_في'
];

export default handler;
