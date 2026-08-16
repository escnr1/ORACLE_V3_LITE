// ════════════════════════════════════════
//  ourin-auto-anime.js — Compatibility shim
//  ⚠️ محتاج مراجعة يدوية: الـ selectors بتاعة winbu.net مبنية على أفضل
//  تخمين للبنية العامة للموقع (مفيش اتصال إنترنت في بيئة البناء للتأكد).
// ════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const DATA_DIR = path.join(process.cwd(), 'system', 'autoanime');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const SENT_FILE = path.join(DATA_DIR, 'sent.json');

function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadState() {
    ensureDir();
    try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
    catch { return { enabled: false, groups: [], interval: 5 }; }
}

export function saveState(state) {
    ensureDir();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function loadSent() {
    ensureDir();
    try { return new Set(JSON.parse(fs.readFileSync(SENT_FILE, 'utf8'))); }
    catch { return new Set(); }
}

export function saveSent(set) {
    ensureDir();
    fs.writeFileSync(SENT_FILE, JSON.stringify([...set]));
}

export async function getOngoingAnimeList() {
    const res = await axios.get('https://winbu.net/', {
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(res.data);
    const list = [];
    $('.bs, .bsx, article').each((_, el) => {
        const title = $(el).find('.tt, h2, h3, a').first().text().trim();
        const link = $(el).find('a').first().attr('href');
        if (title && link) list.push({ title, link });
    });
    return list;
}

let _timer = null;
export function isRunning() { return _timer !== null; }

export function stopAutoCheck() {
    if (_timer) { clearInterval(_timer); _timer = null; }
}

export async function runCheck(sock) {
    const state = loadState();
    const sent = loadSent();
    const groups = state.groups || [];
    if (!groups.length) return;

    const list = await getOngoingAnimeList();
    const fresh = list.filter(a => !sent.has(a.link));

    for (const anime of fresh.slice(0, 5)) {
        sent.add(anime.link);
        if (sock) {
            for (const g of groups) {
                try {
                    await sock.sendMessage(g, {
                        text: `🎬 *حلقة جديدة!*\n\n📺 ${anime.title}\n🔗 ${anime.link}`
                    });
                } catch {}
            }
        }
    }
    saveSent(sent);
}

export function startAutoCheck(sock, intervalMinutes = 5) {
    stopAutoCheck();
    _timer = setInterval(() => { runCheck(sock).catch(() => {}); }, Math.max(1, intervalMinutes) * 60 * 1000);
    runCheck(sock).catch(() => {});
}
