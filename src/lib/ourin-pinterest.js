// ourin-pinterest.js — Compatibility shim
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function pinterestdl(query) {
    const isUrl = /^https?:\/\//.test(query);
    if (isUrl) {
        const res = await axios.get(query, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
        const $ = cheerio.load(res.data);
        const img = $('meta[property="og:image"]').attr('content');
        return img ? [img] : [];
    }
    const res = await axios.get(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000
    });
    const $ = cheerio.load(res.data);
    const results = [];
    $('img').each((_, el) => {
        const src = $(el).attr('src');
        if (src && src.includes('736x')) results.push(src);
    });
    return results.slice(0, 10);
}

export default { pinterestdl };
