// ourin-jpm-helper.js — Compatibility shim
export async function fetchGroupsSafe(sock) {
    try {
        const groups = await sock.groupFetchAllParticipating();
        return Object.values(groups || {});
    } catch {
        return [];
    }
}

export default { fetchGroupsSafe };
