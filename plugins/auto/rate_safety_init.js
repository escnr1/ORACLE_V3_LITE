

import { wrapConnWithRateSafety } from '../../system/rate_safe_conn.js';

const handler = async (m, { conn }) => {};

handler.before = async (m, { conn }) => {
    wrapConnWithRateSafety(conn);
};

export default handler;
