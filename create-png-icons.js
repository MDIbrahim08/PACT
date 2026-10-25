const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createSolidPNG(width, height, r, g, b, a = 255) {
  // Construct a minimal uncompressed/deflated raw RGBA PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw Image Data (filter byte 0 per line + RGBA pixels)
  const lineLength = 1 + width * 4;
  const rawData = Buffer.alloc(lineLength * height);

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineLength;
    rawData[lineOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pixelOffset = lineOffset + 1 + x * 4;
      // Draw subtle circular / gradient badge in center
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.42;

      if (dist < radius) {
        rawData[pixelOffset] = 2; // R
        rawData[pixelOffset + 1] = 115; // G
        rawData[pixelOffset + 2] = 197; // B (Brand #0273c5)
        rawData[pixelOffset + 3] = 255;
      } else {
        rawData[pixelOffset] = 8; // R
        rawData[pixelOffset + 1] = 12; // G
        rawData[pixelOffset + 2] = 20; // B (#080c14 background)
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const deflatedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', deflatedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// Standard CRC32 for PNG chunks
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createSolidPNG(192, 192, 2, 115, 197));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createSolidPNG(512, 512, 2, 115, 197));
console.log('Successfully generated icon-192.png and icon-512.png!');
