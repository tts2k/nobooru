const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs');

const generateSha256Sum = (fileBuffer) => {
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
}

// Get image size, generate thumbnail
const processImage = async (imageBuffer) => {
    const image = await sharp(imageBuffer)
    const thumbnailBuffer = image.resize({ width: 200 });
    const metadata = await image.metadata();
    return {
        thumbnailBuffer: thumbnailBuffer,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
    }
}

const writeBufferToPath = async (buffer, path, fileName) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    return fs.promises.writeFile(`${path}/${fileName}`, buffer);
}

module.exports = { generateSha256Sum, processImage, writeBufferToPath }
