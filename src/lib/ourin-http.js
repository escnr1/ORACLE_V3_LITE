// ourin-http.js — Compatibility shim
// f(url) -> JSON, f(url,'arrayBuffer') -> Buffer, f(url,'text') -> نص خام
import axios from 'axios';

export async function f(url, mode = 'json', options = {}) {
    const responseType =
        mode === 'arrayBuffer' ? 'arraybuffer' :
        mode === 'text' ? 'text' : 'json';

    const res = await axios.get(url, {
        responseType,
        timeout: 45000,
        headers: { 'User-Agent': 'Mozilla/5.0', ...(options.headers || {}) },
        ...options
    });

    if (mode === 'arrayBuffer') {
        return Buffer.isBuffer(res.data) ? res.data : Buffer.from(res.data);
    }
    return res.data;
}

export default f;
