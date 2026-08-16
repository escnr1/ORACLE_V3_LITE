// likee.js — Compatibility shim
import axios from 'axios';

export default async function likee(url) {
    const res = await axios.get(`https://api-faa.my.id/faa/likee`, { params: { url }, timeout: 30000 });
    return res.data?.result || res.data;
}
