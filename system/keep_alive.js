// keep_alive.js - مكتبة منع نوم/تعليق/توقف السيرفر
// 🛡️ بتتابع 3 حاجات: الـ event loop (هنج), اتصال واتساب (انقطاع), الميموري (تسريب)

/**
 * 1) Event-loop Watchdog
 * بيتأكد إن الـ event loop شغال وبيرد، لو "علّق" أكتر من حد معين بيسجل تحذير
 * (مينفعش "نفك" event loop متعلق فعليًا، بس بيساعد نكتشف ونسجل ونمنع تراكم المشكلة)
 */
const startHeartbeat = () => {
    let lastTick = Date.now();
    const TICK_MS = 5000;
    const STALL_THRESHOLD_MS = 20000; // لو فات 20 ثانية من غير tick = في تعليق

    setInterval(() => {
        const now = Date.now();
        const gap = now - lastTick;
        if (gap > STALL_THRESHOLD_MS) {
            console.warn(`⚠️ [Watchdog] الـ event loop كان متأخر ${gap}ms - ممكن يكون فيه عملية بطيئة`);
        }
        lastTick = now;
    }, TICK_MS).unref?.();
};

/**
 * 2) Connection Watchdog
 * بيتابع حالة اتصال واتساب (client.sock) ولو فضل مقطوع أكتر من حد معين
 * بيحاول يجبر إعادة الاتصال بدل ما يستنى الـ auto-reconnect الداخلي
 */
const startConnectionWatchdog = (client, { checkEveryMs = 15000, maxDisconnectedMs = 90000, pairingGraceMs = 300000 } = {}) => {
    let disconnectedSince = null;
    let hasConnectedOnce = false;
    const startedAt = Date.now();

    setInterval(async () => {
        try {
            const sock = client?.sock;
            const isOpen = sock?.user && sock?.ws?.readyState === 1; // 1 = OPEN

            if (isOpen) hasConnectedOnce = true;

            // 🛡️ لسه في مرحلة الـ pairing (ولا اتصل ولا مرة) - سيبه يستنى من غير ما يعمل ريستارت
            // عشان منلغيش كود الـ pairing قبل ما المستخدم يقدر يدخله
            if (!hasConnectedOnce && (Date.now() - startedAt) < pairingGraceMs) {
                return;
            }

            if (!isOpen) {
                if (!disconnectedSince) disconnectedSince = Date.now();
                const downFor = Date.now() - disconnectedSince;

                if (downFor > maxDisconnectedMs) {
                    console.warn(`⚠️ [Watchdog] الاتصال مقطوع من ${Math.round(downFor / 1000)}s - بحاول أعيد الاتصال يدويًا`);
                    disconnectedSince = Date.now(); // ريسيت العداد عشان منعملش محاولات متكررة كل ثانية
                    try {
                        if (typeof client.start === 'function') {
                            await client.start();
                        } else if (typeof client.reconnect === 'function') {
                            await client.reconnect();
                        }
                    } catch (e) {
                        console.warn('[Watchdog] محاولة إعادة الاتصال مضربت:', e?.message);
                    }
                }
            } else {
                disconnectedSince = null;
            }
        } catch (e) {
            // تجاهل أي خطأ هنا - الهدف يفضل شغال مش يكراش
        }
    }, checkEveryMs).unref?.();
};

/**
 * 3) Memory Guard
 * بيتابع استهلاك الميموري، ولو طلعت فوق حد معين بينضف الـ caches الداخلية
 * (مش بيوقف أو يعمل restart - بس بينضف البيانات المؤقتة المتراكمة)
 */
const startMemoryGuard = ({ checkEveryMs = 60000, maxHeapMB = 700 } = {}) => {
    setInterval(() => {
        try {
            const used = process.memoryUsage();
            const heapMB = Math.round(used.heapUsed / 1024 / 1024);

            if (heapMB > maxHeapMB) {
                console.warn(`⚠️ [MemoryGuard] استهلاك الميموري ${heapMB}MB - بنضف الكاش الداخلي`);

                // تنظيف بيانات الجروبات المؤقتة المتراكمة (مش الإعدادات الدائمة)
                if (global._gs) {
                    for (const chatId of Object.keys(global._gs)) {
                        const g = global._gs[chatId];
                        // تنظيف warnings المنتهية (= 0)
                        if (g.warnings) {
                            for (const k of Object.keys(g.warnings)) {
                                if (g.warnings[k] === 0) delete g.warnings[k];
                            }
                        }
                    }
                }

                // فرض garbage collection لو متاح (--expose-gc)
                if (typeof global.gc === 'function') {
                    global.gc();
                    console.log('✅ [MemoryGuard] الـ garbage collection اتشغل');
                }
            }
        } catch (e) {
            // تجاهل
        }
    }, checkEveryMs).unref?.();
};

/**
 * 4) Idle Prevention (لمنصات تستخدم health-check خارجي)
 * مفيدة فقط لو المنصة عندها idle-timeout بيعتمد على عدم وجود نشاط شبكي
 * بتعمل "نبضة" داخلية كل فترة - بدون فتح بورت أو سيرفر HTTP
 */
const startInternalPing = ({ everyMs = 240000 } = {}) => {
    setInterval(() => {
        // عملية خفيفة جداً بس تخلي الـ process "نشط" فعليًا (CPU tick حقيقي)
        const ts = new Date().toISOString();
        process.stdout.write(''); // touch stdout - بدون إغراق اللوج
        global._lastPing = ts;
    }, everyMs).unref?.();
};

/**
 * الدالة الرئيسية - شغّل كل أنظمة الحماية مرة واحدة
 */
export const keepServerAlive = (client, options = {}) => {
    console.log('🛡️ [KeepAlive] بشغّل نظام منع النوم/التعليق/التوقف...');

    startHeartbeat();
    startConnectionWatchdog(client, options.connection);
    startMemoryGuard(options.memory);
    startInternalPing(options.ping);

    console.log('✅ [KeepAlive] النظام شغال - السيرفر محمي من النوم والتعليق');
};

export default keepServerAlive;
