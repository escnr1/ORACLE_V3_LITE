// ourin-sticker-command.js — Compatibility shim: ربط أوامر مخصصة بملصقات
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const FILE = path.join(process.cwd(), 'system', 'sticker-commands.json');

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return {}; }
}
function save(data) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getQuotedStickerHash(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex');
}

export function addStickerCommand(hash, command, response) {
    const data = load();
    data[hash] = { command, response };
    save(data);
    return true;
}

export function deleteStickerCommand(hash) {
    const data = load();
    delete data[hash];
    save(data);
    return true;
}

export function listStickerCommands() {
    return Object.entries(load()).map(([hash, v]) => ({ hash, ...v }));
}

export function findByCommand(command) {
    const data = load();
    return Object.entries(data).find(([, v]) => v.command === command)?.[1] || null;
}

export default { getQuotedStickerHash, addStickerCommand, deleteStickerCommand, listStickerCommands, findByCommand };
