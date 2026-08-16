// img2prompt.js — Compatibility shim: استخراج وصف/prompt من صورة
import axios from 'axios';
import fs from 'fs';
import uploadImage from '../lib/ourin-uploader.js';

export default async function imgtoprompt(imagePath) {
    const buffer = fs.readFileSync(imagePath);
    const url = await uploadImage(buffer, 'image.jpg');
    const res = await axios.get('https://api-faa.my.id/faa/img2prompt', { params: { url }, timeout: 40000 });
    return res.data?.result || res.data?.prompt || '';
}
