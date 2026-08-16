# 📦 DRAKON BOT - Libraries

## الاستخدام في index.js

```js
import autoJoinChannel from './libs/auto-join-channel.js';
import BotDetector from './libs/bot-detector.js';

client.start();

// 1. انضمام تلقائي للقناة
autoJoinChannel(client);

// 2. كشف البوتات
const detector = new BotDetector(client, {
    ownerJid:     '201092178171@s.whatsapp.net',
    autoWarn:     true,       // إنذار 3 مرات ثم طرد
    autoKick:     false,      // طرد مباشر بدون إنذار
    antiBotMode:  false,      // طرد فوري لأي بوت
    sessionPaths: ['./sessions'],
});
detector.start();

// تفعيل وضع الطرد الفوري
// detector.enableAntiBotMode();
```

## الأوامر

| الأمر | الوصف |
|-------|-------|
| `.ضد_البوتات on` | تفعيل الطرد الفوري |
| `.ضد_البوتات off` | تعطيل الطرد الفوري |
