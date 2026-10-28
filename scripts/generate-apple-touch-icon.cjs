const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

// Generates a valid 180x180 PNG file for apple-touch-icon.png using Node.js built-in modules (zlib)
// Design: Black rounded background with gold (#FAB319) double-P monogram matching PERES PERES brand
const WIDTH = 180
const HEIGHT = 180

// Create raw uncompressed image data (RGBA): each scanline starts with filter byte 0
const rawData = Buffer.alloc(HEIGHT * (1 + WIDTH * 4))

const BG_COLOR = [10, 10, 10, 255] // #0A0A0A
const GOLD_COLOR = [250, 179, 25, 255] // #FAB319

// Monogram check on coordinate (x, y)
function isP1(x, y) {
  // P1 box: x: 42 to 102, y: 45 to 135
  const inStem = x >= 42 && x <= 58 && y >= 45 && y <= 135
  const inTopBar = x >= 42 && x <= 95 && y >= 45 && y <= 60
  const inMidBar = x >= 42 && x <= 95 && y >= 82 && y <= 97
  // Loop curve: outer circle centered around (80, 71) radius 26, inner radius 11
  const dx = x - 80
  const dy = y - 71
  const distSq = dx * dx + dy * dy
  const inLoopRight = x >= 78 && distSq <= 26 * 26 && distSq >= 11 * 11

  return inStem || inTopBar || inMidBar || inLoopRight
}

function isP2(x, y) {
  // P2 box: shifted right by 40px: x: 82 to 142, y: 45 to 135
  const inStem = x >= 84 && x <= 100 && y >= 45 && y <= 135
  const inTopBar = x >= 84 && x <= 137 && y >= 45 && y <= 60
  const inMidBar = x >= 84 && x <= 137 && y >= 82 && y <= 97
  const dx = x - 122
  const dy = y - 71
  const distSq = dx * dx + dy * dy
  const inLoopRight = x >= 120 && distSq <= 26 * 26 && distSq >= 11 * 11

  return inStem || inTopBar || inMidBar || inLoopRight
}

for (let y = 0; y < HEIGHT; y++) {
  const lineOffset = y * (1 + WIDTH * 4)
  rawData[lineOffset] = 0 // Filter type: None

  for (let x = 0; x < WIDTH; x++) {
    const pixelOffset = lineOffset + 1 + x * 4

    // Check if in P1 or P2
    if (isP1(x, y) || isP2(x, y)) {
      rawData[pixelOffset] = GOLD_COLOR[0]
      rawData[pixelOffset + 1] = GOLD_COLOR[1]
      rawData[pixelOffset + 2] = GOLD_COLOR[2]
      rawData[pixelOffset + 3] = GOLD_COLOR[3]
    } else {
      rawData[pixelOffset] = BG_COLOR[0]
      rawData[pixelOffset + 1] = BG_COLOR[1]
      rawData[pixelOffset + 2] = BG_COLOR[2]
      rawData[pixelOffset + 3] = BG_COLOR[3]
    }
  }
}

// Compress image data with zlib deflate
const compressedData = zlib.deflateSync(rawData)

// Helper to create PNG chunk with CRC32
function createChunk(type, data) {
  const length = data.length
  const buffer = Buffer.alloc(12 + length)
  buffer.writeUInt32BE(length, 0)
  buffer.write(type, 4, 4, 'ascii')
  data.copy(buffer, 8)

  const crcData = buffer.subarray(4, 8 + length)
  const crc = crc32(crcData)
  buffer.writeInt32BE(crc, 8 + length)
  return buffer
}

// Standard PNG CRC32 table
const crcTable = new Int32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1)
    } else {
      c = c >>> 1
    }
  }
  crcTable[n] = c
}

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return c ^ -1
}

// PNG Signature: 89 50 4E 47 0D 0A 1A 0A
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

// IHDR Chunk: 13 bytes
const ihdrData = Buffer.alloc(13)
ihdrData.writeUInt32BE(WIDTH, 0)
ihdrData.writeUInt32BE(HEIGHT, 4)
ihdrData[8] = 8 // bit depth: 8 bits/channel
ihdrData[9] = 6 // color type: 6 (RGBA)
ihdrData[10] = 0 // compression: deflate
ihdrData[11] = 0 // filter: standard
ihdrData[12] = 0 // interlace: none
const ihdrChunk = createChunk('IHDR', ihdrData)

// IDAT Chunk
const idatChunk = createChunk('IDAT', compressedData)

// IEND Chunk
const iendChunk = createChunk('IEND', Buffer.alloc(0))

const finalPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])

const outPath = path.resolve(__dirname, '../public/apple-touch-icon.png')
fs.writeFileSync(outPath, finalPng)
console.log(`Successfully generated ${outPath} (${finalPng.length} bytes, ${WIDTH}x${HEIGHT})`)
