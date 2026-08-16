// ourin-tmpfiles.js — Compatibility shim
// بيرفع الصورة ويرجع { directUrl } — بيستخدم نفس أسلوب ourin-uploader.js
import uploadImage from './ourin-uploader.js';

export async function uploadToTmpFiles(buffer, options = {}) {
    const url = await uploadImage(buffer, options.filename || 'image.jpg');
    return { directUrl: url, url };
}

export default { uploadToTmpFiles };
