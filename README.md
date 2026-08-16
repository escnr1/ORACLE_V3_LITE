<div align="center">

# 🌑 𝗘 𝗦 𝗖 𝗔 𝗡 𝗢 𝗥   𝗩 𝟯 🌑
### ⟨ بــوت واتــســاب الــســيــبــرانــي ⟩

<img src="https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg" alt="DRAKON V3" width="550"/>

[![Version](https://img.shields.io/badge/Version-3.0.0-black?style=for-the-badge&logo=whatsapp&logoColor=cyan)]()
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-black?style=for-the-badge&logo=node.js&logoColor=green)]()
[![Channel](https://img.shields.io/badge/Channel-ESCNOR_LABS-black?style=for-the-badge&logo=whatsapp&logoColor=cyan)](https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f)
[![Group](https://img.shields.io/badge/Group-Join_Us-black?style=for-the-badge&logo=whatsapp&logoColor=cyan)](https://chat.whatsapp.com/BR3vHZUaLjy1qwhS3ttQpJ?s=cl&p=a&ilr=1)
[![Telegram](https://img.shields.io/badge/Telegram-br__kan242-black?style=for-the-badge&logo=telegram&logoColor=cyan)](https://t.me/br_kan242)
[![YouTube](https://img.shields.io/badge/YouTube-drakon__soft--1-black?style=for-the-badge&logo=youtube&logoColor=red)](https://youtube.com/@drakon_soft-1?si=NQXfvUay8ZvzBBzB)

> **بوت واتساب متكامل، مبني على بنية إطار العمل [Drakon](https://github.com/moreand458-eng/drakon)**

[التثبيت](#-التثبيت-والتشغيل) • [المميزات](#-المميزات) • [الأوامر](#-نظرة-عامة-على-الأوامر) • [إدارة الروابط](#-نظام-إدارة-الروابط) • [المطور](#-المطور-والحقوق)

</div>

---

## ⚡ المميزات

- ⚙️ **هيكل برمجي سلس:** بوت مصمم ليكون بسيطاً، قوياً، ومستقراً.
- 🔘 **قائمة أزرار تفاعلية:** واجهة قائمة رئيسية ديناميكية عبر `menu_builder.js`، مع تراجع تلقائي لنص عادي لو فشلت الأزرار.
- 🛠️ **زر "تنصيب" مدمج:** اضغط زر واحد من القائمة الرئيسية عشان تبدأ تنصيب البوت على جهازك (نفس أمر `.تنصيب`).
- 🧩 **دمج كامل لمجموعة أوامر جديدة** (أكثر من 65 أمر) من حزمة `plugins-vonr`، بعد إعادة كتابتها بالكامل لتتوافق 100% مع نظام DRAKON:
  - 🤖 **ذكاء اصطناعي:** توليد صور، تحويل شخصيات لأنمي/كرتون/فيجر/3D، شات بوتات AI متعددة.
  - 🖼️ **مؤثرات (canvas):** ميمز، شهادات ساخرة، بطاقات مطلوب/مطرود، رندر معادلات رياضية (LaTeX)، بطاقات فيسبوك/قصص وهمية للمزح.
  - 🎌 **أنمي:** متابعة تلقائية لحلقات الأنمي الجديدة من winbu.net.
  - 📸 **محتوى عشوائي:** صور/فيديوهات تيك توك وغيرها.
  - 🎊 **تسلية:** حقيقة أو تحدي، تأملات يومية، وأوامر تفاعلية بسيطة.
- 📚 **مكتبات مدمجة إضافية** من `lib-bode`: تحويل ورفع الملصقات، رفع صور/ملفات، تكامل Google Drive، MongoDB، نظام مستويات (levelling)، وغيرها كأدوات جاهزة للاستخدام.
- 🔗 **نظام إدارة روابط مركزي:** عرض كل روابط البوت وتعديلها بأمر واحد من غير لمس الكود.
- 🚀 **سرعة استجابة عالية** ومرونة كاملة في التعديل.

> ⚠️ **تنبيه أمانة:** بعض الأوامر اتلقت رفض قصدي للدمج لأنها كانت مبنية لتوليد أدلة دفع مزوّرة (سكرين شوت تحويل بنكي/محفظة إلكترونية وهمي) أو مكالمات وهمية أو محتوى جنسي غير مقيّد. الأوامر دي مش موجودة في هذه النسخة عمداً.

---

## 💻 التثبيت والتشغيل

> **البيئة المستهدفة:** `Termux (Android)` أو أي سيرفر Linux فيه Node.js 18+

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs -y

# فك ضغط مجلد المشروع ثم داخل مجلد drakon:
cd drakon
npm install
npm start
```

بعد التشغيل، امسح كود الـ QR أو استخدم كود الاقتران (Pairing Code) لربط رقم واتساب بالبوت.

### 🛠️ التنصيب من داخل واتساب (البوتات الفرعية)

بعد ما يشتغل البوت الأساسي، أي حد يقدر يعمل نسخة فرعية (Sub-Bot) بنفس رقمه عن طريق:

- الضغط على زر **"تنصيب"** في القائمة الرئيسية، **أو**
- إرسال الأمر مباشرة:
```
.تنصيب
```

### ⚙️ إعداد مفاتيح الـ API

بعض أوامر الذكاء الاصطناعي المدمجة (زي `nanobanana`) بتحتاج مفتاح API خاص بيها. حط المفاتيح في متغيرات البيئة قبل التشغيل، أو عدّل `config.js` مباشرة:

```bash
export COVENANT_APIKEY="مفتاحك_هنا"
export NEOXR_APIKEY="مفتاحك_هنا"
export LOLHUMAN_APIKEY="مفتاحك_هنا"
```

---

## 📜 نظرة عامة على الأوامر

| القسم | الوصف | أمثلة |
|---|---|---|
| 🤖 الذكاء الاصطناعي | شات بوتات AI، توليد وتحويل صور | `.ai4chat` `.toanime` `.tofigure` `.nanobanana` |
| 🖼️ المؤثرات | ميمز وبطاقات وتأثيرات صور | `.wasted` `.jail` `.math` `.iqc` |
| 🎌 الأنمي | متابعة حلقات جديدة تلقائياً | `.autoanimewinbu` |
| 📸 محتوى | محتوى عشوائي متنوع | `.asupan` `.asupantiktok` |
| 🎊 التسلية | ألعاب وتفاعل بسيط | `.truth` `.renungan` `.senja` |
| 🛠️ الأدوات | أدوات عامة للبوت | `.تنصيب` `.kill` |
| 🔗 الروابط | إدارة روابط البوت | `.الروابط` `.تعديل_رابط` |

> استخدم الأمر `.menu` أو الضغط على زر القائمة لعرض كل الأقسام والأوامر بالتفصيل مع الأمثلة.

---

## 🔗 نظام إدارة الروابط

بدل ما تدور على الروابط جوه الكود وتعدلها يدوياً، البوت فيه نظام مركزي:

**عرض كل الروابط:**
```
.الروابط
```
هيطلعلك كل روابط البوت مقسمة حسب النوع (واتساب / تيليجرام / يوتيوب...).

**تغيير أي رابط:**
```
.تعديل_رابط <المفتاح> <الرابط الجديد>
```
مثال:
```
.تعديل_رابط group https://chat.whatsapp.com/xxxxxxxx
```
الرابط الجديد بيتحفظ تلقائياً في `system/links.json`، ومفيش داعي تلمس أي ملف كود.

---

## ⚠️ ملاحظات مهمة للمطور اللي هيكمل شغل على المشروع

- بعض أوامر `plugins/vonr` بتعتمد على APIs خارجية صغيرة (my.id، herokuapp، إلخ). دول بطبيعتهم عرضة للتوقف من وقت للتاني — لو لقيت أمر مش شغال، شوف الـ endpoint بتاعه في نفس الملف واستبدله.
- ملفات `src/lib/ourin-*.js` و`src/scraper/*.js` هي **طبقة توافق (compatibility shims)** اتبنت من الصفر لأن المكتبات الأصلية اللي كانت الأوامر بتعتمد عليها مكانتش موجودة في الباتش المُرسل. لو عندك نسخة أصلية منها، تقدر تستبدلها.
- ميزة متابعة الأنمي التلقائية (`autoanimewinbu`) بتعتمد على تخمين لبنية صفحة winbu.net لأن بيئة البناء متصلتش بالإنترنت للتأكد؛ راجعها قبل الاعتماد عليها في بيئة إنتاج.

---

## 👑 المطور والحقوق

<div align="center">

### ⏤͟͟͞𝐋𝐨𝐫𝐝 𝐃𝐑𝐀𝐊𝐎𝐍☀︎
### إسـڪـانـوࢪ

**𝐄𝐒𝐂𝐀𝐍𝐎𝐑 𝐕𝟑** — كل الحقوق محفوظة

[![WhatsApp Channel](https://img.shields.io/badge/تابعنا-قناة_واتساب-25D366?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f)
[![Group](https://img.shields.io/badge/انضم-الجروب-25D366?style=for-the-badge&logo=whatsapp)](https://chat.whatsapp.com/BR3vHZUaLjy1qwhS3ttQpJ?s=cl&p=a&ilr=1)
[![Telegram](https://img.shields.io/badge/تليجرام-br__kan242-26A5E4?style=for-the-badge&logo=telegram)](https://t.me/br_kan242)
[![YouTube](https://img.shields.io/badge/يوتيوب-drakon__soft--1-FF0000?style=for-the-badge&logo=youtube)](https://youtube.com/@drakon_soft-1?si=NQXfvUay8ZvzBBzB)

</div>

---

<div align="center">
<sub>مبني بـ 🖤 بواسطة ⏤͟͟͞𝐋𝐨𝐫𝐝 𝐃𝐑𝐀𝐊𝐎𝐍☀︎</sub>
</div>
