// ourin-store-backup.js — Compatibility shim
import fs from 'fs';
import path from 'path';

export const SCHEMA_VERSION = 1;

export async function sendStoreBackup(conn, targetJid) {
    const file = path.join(process.cwd(), 'system', 'ourin-database.json');
    try {
        const buffer = fs.readFileSync(file);
        await conn.sendMessage(targetJid, {
            document: buffer,
            fileName: `store-backup-${Date.now()}.json`,
            mimetype: 'application/json'
        });
        return true;
    } catch {
        return false;
    }
}

export default { sendStoreBackup, SCHEMA_VERSION };
