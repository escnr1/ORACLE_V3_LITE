<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=220&section=header&text=ORACLE%20V3&fontSize=70&fontColor=00fff2&fontAlignY=38&desc=البوت%20السيبراني%20الأقوى%20على%20واتساب&descAlignY=58&descSize=20&animation=fadeIn" width="100%"/>

![Version](https://img.shields.io/badge/VERSION-3.0.0-0f0c29?style=for-the-badge&labelColor=000000&color=00fff2)
![Node](https://img.shields.io/badge/NODE.JS-≥18-0f0c29?style=for-the-badge&labelColor=000000&color=8A2BE2&logo=nodedotjs&logoColor=8A2BE2)
![Status](https://img.shields.io/badge/STATUS-ACTIVE-0f0c29?style=for-the-badge&labelColor=000000&color=39FF14)
![License](https://img.shields.io/badge/LICENSE-PRIVATE-0f0c29?style=for-the-badge&labelColor=000000&color=FF2079)

<br/>

[![WhatsApp Channel](https://img.shields.io/badge/📢_ORACLE_LABS-000000?style=for-the-badge&logo=whatsapp&logoColor=25D366)](https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f)
[![WhatsApp Group](https://img.shields.io/badge/💬_انضم_للجروب-000000?style=for-the-badge&logo=whatsapp&logoColor=25D366)](https://chat.whatsapp.com/BR3vHZUaLjy1qwhS3ttQpJ?s=cl&p=a&ilr=1)
[![Telegram](https://img.shields.io/badge/✈️_br__kan242-000000?style=for-the-badge&logo=telegram&logoColor=26A5E4)](https://t.me/br_kan242)
[![YouTube](https://img.shields.io/badge/▶️_drakon__soft--1-000000?style=for-the-badge&logo=youtube&logoColor=FF0000)](https://youtube.com/@drakon_soft-1?si=NQXfvUay8ZvzBBzB)

<br/>

<img src="https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg" alt="ORACLE V3" width="480" style="border-radius: 16px; box-shadow: 0 0 40px #00fff2;"/>

<br/><br/>

> ### مبني على بنية إطار العمل [**DRAKON**](https://github.com/moreand458-eng/drakon) — سريع، مستقر، وقابل للتوسع بالكامل

<br/>

<a href="#-التثبيت-والتشغيل"><img src="https://img.shields.io/badge/🚀_التثبيت-00fff2?style=for-the-badge&labelColor=0f0c29" /></a>
<a href="#-المميزات"><img src="https://img.shields.io/badge/⚡_المميزات-8A2BE2?style=for-the-badge&labelColor=0f0c29" /></a>
<a href="#-نظرة-عامة-على-الأوامر"><img src="https://img.shields.io/badge/📜_الأوامر-FF2079?style=for-the-badge&labelColor=0f0c29" /></a>
<a href="#-نظام-إدارة-الروابط"><img src="https://img.shields.io/badge/🔗_الروابط-39FF14?style=for-the-badge&labelColor=0f0c29" /></a>
<a href="#-المطور-والحقوق"><img src="https://img.shields.io/badge/👑_المطور-FFD700?style=for-the-badge&labelColor=0f0c29" /></a>

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## ⚡ المميزات

### ⚙️ الأساسيات
- **هيكل برمجي سلس** — بوت مصمم ليكون بسيطاً، قوياً، ومستقراً
- **قائمة أزرار تفاعلية** ديناميكية عبر `menu_builder.js`، مع تراجع تلقائي لنص عادي لو فشلت الأزرار
- **زر "تنصيب" مدمج** — اضغط زر واحد من القائمة الرئيسية لتنصيب نسخة فرعية من البوت فوراً
- **سرعة استجابة عالية** ومرونة كاملة في التعديل

### 🧩 حزمة الأوامر (+65 أمر)
- 🤖 **ذكاء اصطناعي** — شات بوتات AI، توليد وتحويل صور
- 🖼️ **مؤثرات Canvas** — ميمز، شهادات، بطاقات، معادلات LaTeX
- 🎌 **أنمي** — متابعة تلقائية لحلقات جديدة
- 📸 **محتوى عشوائي** — صور وفيديوهات متنوعة
- 🎊 **تسلية** — حقيقة أو تحدي، تأملات يومية

📚 **مكتبات مدمجة إضافية** من `lib-bode`: تحويل ورفع الملصقات، رفع صور/ملفات، تكامل Google Drive، MongoDB، نظام مستويات (Levelling)، وغيرها كأدوات جاهزة للاستخدام.

🔗 **نظام إدارة روابط مركزي:** عرض كل روابط البوت وتعديلها بأمر واحد من غير لمس الكود.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

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

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 📜 نظرة عامة على الأوامر

| القسم | الوصف | أمثلة |
|:---:|:---|:---|
| 🤖 **الذكاء الاصطناعي** | شات بوتات AI، توليد وتحويل صور | `.ai4chat` `.toanime` `.tofigure` `.nanobanana` |
| 🖼️ **المؤثرات** | ميمز وبطاقات وتأثيرات صور | `.wasted` `.jail` `.math` `.iqc` |
| 🎌 **الأنمي** | متابعة حلقات جديدة تلقائياً | `.autoanimewinbu` |
| 📸 **محتوى** | محتوى عشوائي متنوع | `.asupan` `.asupantiktok` |
| 🎊 **التسلية** | ألعاب وتفاعل بسيط | `.truth` `.renungan` `.senja` |
| 🛠️ **الأدوات** | أدوات عامة للبوت | `.تنصيب` `.kill` |
| 🔗 **الروابط** | إدارة روابط البوت | `.الروابط` `.تعديل_رابط` |

> 💡 استخدم الأمر `.menu` أو الضغط على زر القائمة لعرض كل الأقسام والأوامر بالتفصيل مع الأمثلة.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

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

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## ⚠️ ملاحظات مهمة للمطور اللي هيكمل شغل على المشروع

- بعض أوامر `plugins/vonr` بتعتمد على APIs خارجية صغيرة (my.id، herokuapp، إلخ). دول بطبيعتهم عرضة للتوقف من وقت للتاني — لو لقيت أمر مش شغال، شوف الـ endpoint بتاعه في نفس الملف واستبدله.
- ملفات `src/lib/ourin-*.js` و`src/scraper/*.js` هي **طبقة توافق (compatibility shims)** اتبنت من الصفر لأن المكتبات الأصلية اللي كانت الأوامر بتعتمد عليها مكانتش موجودة في الباتش المُرسل. لو عندك نسخة أصلية منها، تقدر تستبدلها.
- ميزة متابعة الأنمي التلقائية (`autoanimewinbu`) بتعتمد على تخمين لبنية صفحة winbu.net لأن بيئة البناء متصلتش بالإنترنت للتأكد؛ راجعها قبل الاعتماد عليها في بيئة إنتاج.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 👑 المطور والحقوق

<div align="center">

### **𝐎𝐑𝐀𝐂𝐋𝐄 𝐕𝟑** — كل الحقوق محفوظة

<br/>

| الدور | الاسم |
|:---:|:---:|
| 👑 المبرمج الرئيسي والأساسي | **𝐋𝐨𝐫𝐝 𝐄𝐒𝐂𝐀𝐍𝛩𝐑** |
| 🛡️ المطور | **𝐕𝑬𝑵𝕆𝑀** |

<br/>

[![WhatsApp Channel](https://img.shields.io/badge/تابعنا-قناة_واتساب-25D366?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f)
[![Group](https://img.shields.io/badge/انضم-الجروب-25D366?style=for-the-badge&logo=whatsapp)](https://chat.whatsapp.com/BR3vHZUaLjy1qwhS3ttQpJ?s=cl&p=a&ilr=1)
[![Telegram](https://img.shields.io/badge/تليجرام-br__kan242-26A5E4?style=for-the-badge&logo=telegram)](https://t.me/br_kan242)
[![YouTube](https://img.shields.io/badge/يوتيوب-drakon__soft--1-FF0000?style=for-the-badge&logo=youtube)](https://youtube.com/@drakon_soft-1?si=NQXfvUay8ZvzBBzB)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer"/>

<div align="center">
<sub>مبني بـ 🖤 بواسطة 𝐋𝐨𝐫𝐝 𝐄𝐒𝐂𝐀𝐍𝛩𝐑☀︎</sub>
</div>
