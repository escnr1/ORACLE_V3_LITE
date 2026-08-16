import { resolveRealNumber } from '../../system/admin_utils.js';

const run = async (m, { args, conn, bot }) => {
  if (global.db.noSub) return m.reply("*يا باشا المطور قافل التنصيب دلوقتي، استنى شوية وارجع تاني*")
  try {
    const manualNum = args[0]?.replace(/[+\s-]/g, '');
    let num = manualNum && /^\d{8,15}$/.test(manualNum)
        ? manualNum
        : await resolveRealNumber(m.sender, conn);

    if (!num || !/^\d+$/.test(num)) {
      return m.reply(
        "⚠️ *مقدرش أطلع رقمك الحقيقي يا كبير.*\n\n" +
        "يمكن حاطط *يوزر نيم* بدل الرقم، وده بيخلي واتساب يبعتلي كود داخلي (LID) مش رقمك الفعلي.\n\n" +
        "*الحل:* روح شيّل اليوزر نيم من إعدادات واتساب وجرب تاني، أو اكتب الرقم بإيدك كده:\n.تنصيب 201xxxxxxxxx"
      );
    }

    if (global.db.users[`${num}@s.whatsapp.net`]?.banned) {
      return m.reply(`*🚫 الرقم ${num} متبلوك من المطور، مش هيقدر ينصب بوت*`);
    }

    const sub = global.subBots;
    if (!sub) return m.reply("*⚠ نظام البوتات الفرعية مقفول دلوقتي يا معلم*");

    const init = await m.reply(`🤖 استنى شوية بينصّب بوت للرقم *${num}*...`);

    const state = { uid: null, pairDone: false, resolved: false, pending: null };

    const { images: img } = bot.config.info;

    const cleanup = () => {
      sub.off('pair', handlers.pair);
      sub.off('ready', handlers.ready);
      sub.off('error', handlers.error);
    };

    const handlers = {
      pair: (id, code) => {
        if (state.pairDone) return;
        if (!state.uid) {
          state.pending = { id, code };
          return;
        }
        if (id !== state.uid) return;
        state.pairDone = true;
        Func.pair(conn, code, num, m, init);
      },
      ready: (id) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.ready(conn, num, m, img[Math.floor(Math.random() * img.length)]);
        cleanup();
      },
      error: (id, err) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.error(conn, num, err, m);
        cleanup();
      },
    };

    sub.on('pair', handlers.pair);
    sub.on('ready', handlers.ready);
    sub.on('error', handlers.error);

    state.uid = await sub.add(num);

    if (state.pending?.id === state.uid && !state.pairDone) {
      state.pairDone = true;
      Func.pair(conn, state.pending.code, num, m, init);
    }

    setTimeout(() => {
      if (state.resolved) return;
      state.resolved = true;
      Func.timeout(conn, m, state.pairDone);
      cleanup();
    }, 120000);

  } catch (error) {
    await m.reply(error.message);
  }
};

run.command = ["تنصيب"];
run.noSub = false;
run.fromMe = true;
run.usage =  ["تنصيب"];
run.category = "sub";
export default run;

const Func = {
  pair: async (conn, code, num, m, reply_status) => {
    await conn.sendButton(m.chat, {
      imageUrl: "https://raw.githubusercontent.com/moreand204-dot/photo/main/file_000000002a5c81f5a1c36ca0005f6f33.png",
      bodyText: `🤖⤿ نـظـام الـبـوتـات الـفـرعـيـه 🤖
•┊⋅ ──────────── ⋅┊•
📱 — الرقم: ${num}
🔑 — الكود: ${code}
•┊⋅ ──────────── ⋅┊•
> *_افتح واتساب واخش الأجهزة المرتبطة، بعدين ربط جهاز برقم الهاتف، واكتب الكود ده_*`,
      footerText: "@𝑺𝒚𝒔𝒕𝒆𝒎_𝑺𝒖𝒃𝑩𝒐𝒕𝒔_𝑂𝒓𝒂𝒄𝒍𝒆",
      buttons: [
        { name: "cta_copy", params: { display_text: "⟨📋|* كـود التـنـصـيـب *|📋⟩", copy_code: code } },
        { name: "cta_url", params: { display_text: "⟨👨🏻‍💻| قنـاة الـمـطـور |👨🏻‍💻⟩", url: "https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f" } },
      ],
      mentions: [m.sender],
      interactiveConfig: {
        buttons_limits: 10,
        list_title: "@𝑺𝒚𝒔𝒕𝒆𝒎_𝑺𝒖𝒃𝑩𝒐𝒕𝒔_𝑂𝒓𝒂𝒄𝒍𝒆",
        button_title: "Click Here",
        canonical_url: `https://code.com/${code}`
      }
    }, reply_status);
  },

  ready: async (conn, num, m, img) => {
    await m.react("✅");
    await conn.sendMessage(m.chat, {
      text: `✅ — *اتظبط واتوصل تمام يا نجم*\n\n📱 الرقم: ${num}\n> *البوت جاهز يشتغل من دلوقتي*`,
      contextInfo: {
        externalAdReply: {
          title: "𝑶𝑹𝑨𝑪𝑳𝑬 𝑩𝑶𝑻👨🏻‍💻🔥 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐟𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
          body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
          thumbnailUrl: img,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  },

  error: async (conn, num, err, m) => {
    await m.reply(`❌ *التنصيب فشل يا صاحبي!*\n\n📱 الرقم: ${num}\n⚠️ حصل ايه: ${err?.message || 'مش عارفين ايه اللي حصل بالظبط'}`);
  },

  timeout: async (conn, m, pairDone) => {
    await m.reply(pairDone
      ? `*الكود اتبعت بس مش تم تأكيد التنصيب اتأكد انك دخلت الكود صح⚠️⏱️*`
      : `*كود التنصيب موصلش جرب تاني بعد شوية مش علي طول⚠️🤌🏻*`
    );
  }
};
