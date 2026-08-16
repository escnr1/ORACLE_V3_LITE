// ourin-ffmpeg.js — Compatibility shim: طابور بسيط لتحديد عدد عمليات ffmpeg المتزامنة
let running = 0;
const MAX_CONCURRENT = 2;
const queue = [];

function next() {
    if (running >= MAX_CONCURRENT || !queue.length) return;
    running++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve()
        .then(fn)
        .then(resolve, reject)
        .finally(() => { running--; next(); });
}

export function queueFFmpeg(fn) {
    return new Promise((resolve, reject) => {
        queue.push({ fn, resolve, reject });
        next();
    });
}

export default { queueFFmpeg };
