// ourin-carbon.js — Compatibility shim: صورة كود بأسلوب carbon.now.sh
import axios from 'axios';

export async function generateCarbon(code, options = {}) {
    const params = new URLSearchParams({
        code,
        bg: options.background || 'rgba(171,184,195,1)',
        t: options.theme || 'seti',
        l: options.language || 'auto'
    });
    const url = `https://carbonara.solopov.dev/api/cook`;
    try {
        const res = await axios.post(url, {
            code,
            backgroundColor: options.background || '#abb8c3',
            theme: options.theme || 'seti'
        }, { responseType: 'arraybuffer', timeout: 30000 });
        return Buffer.from(res.data);
    } catch (e) {
        throw new Error('توليد صورة الكود مضربش');
    }
}

export default { generateCarbon };
