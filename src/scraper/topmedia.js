// topmedia.js — Compatibility shim: تحويل نص لصوت (TTS)
import gtts from 'gtts';
import fs from 'fs';
import os from 'os';
import path from 'path';

export default async function generateCustomTTS(voice, text) {
    return new Promise((resolve, reject) => {
        const tts = new gtts(text, 'ar');
        const file = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);
        tts.save(file, (err) => {
            if (err) return reject(err);
            resolve(file);
        });
    });
}
