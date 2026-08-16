// mconverter.js — Compatibility shim: تحويل صيغ فيديو/صوت
import axios from 'axios';

export async function mconverter(fileUrl, targetFormat) {
    const res = await axios.get(`https://api-faa.my.id/faa/mconvert`, {
        params: { url: fileUrl, to: targetFormat }, timeout: 60000
    });
    return res.data?.result || res.data;
}

export default { mconverter };
