// ourin-zencf.js — Compatibility shim: بحث/تشغيل سبوتيفاي (بديل عن باكدج 'zencf' مش موجودة)
import axios from 'axios';

export async function zencf(query) {
    const res = await axios.get('https://api-faa.my.id/faa/spotify-search', {
        params: { q: query }, timeout: 20000
    });
    return res.data?.result || res.data;
}

export default { zencf };
