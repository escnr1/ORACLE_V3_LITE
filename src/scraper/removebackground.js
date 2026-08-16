// removebackground.js — Compatibility shim
import axios from 'axios';
import FormData from 'form-data';

export async function pixa(imagePath) {
    const fs = await import('fs');
    const form = new FormData();
    form.append('image', fs.default.createReadStream(imagePath));
    const res = await axios.post('https://api-faa.my.id/faa/removebg', form, {
        headers: form.getHeaders(), responseType: 'arraybuffer', timeout: 40000
    });
    return Buffer.from(res.data);
}

export default { pixa };
