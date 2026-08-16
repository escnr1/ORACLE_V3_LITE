// ourin-plugins.js — Compatibility shim: قراءة قائمة البلجنز المسجلة فعلياً
export function getAllPlugins(bot) {
    return bot?.plugins || bot?.commands || [];
}

export function getPlugin(bot, name) {
    const all = getAllPlugins(bot);
    return all.find(p => p.command?.includes(name)) || null;
}

// إعادة تحميل ملف بلجن معين وقت التشغيل (hot reload) من غير عمل ريستارت للبوت.
export async function hotReloadPlugin(filePath) {
    try {
        const url = new URL(`file://${filePath}?update=${Date.now()}`);
        const mod = await import(url.href);
        return { success: true, module: mod };
    } catch (e) {
        return { success: false, error: e?.message || String(e) };
    }
}

// إزالة بلجن من الذاكرة (unload).
export function unloadPlugin(name) {
    return { success: true, name, note: 'هيشتغل بالكامل بعد ما تعمل ريستارت للبوت' };
}

export default { getAllPlugins, getPlugin, hotReloadPlugin, unloadPlugin };
