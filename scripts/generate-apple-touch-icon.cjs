const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

// Parse PNG image from favicon.ico
const icoPath = path.resolve(__dirname, '../public/favicon.ico')
const icoBuf = fs.readFileSync(icoPath)

const size = icoBuf.readUInt32LE(6 + 8)
const offset = icoBuf.readUInt32LE(6 + 12)
const pngBuf = icoBuf.subarray(offset, offset + size)

// Parse PNG chunks
let pos = 8 // skip PNG signature
let width = 0
let height = 0
let bitDepth = 0
let colorType = 0
const idatChunks = []

while (pos < pngBuf.length) {
  const length = pngBuf.readUInt32BE(pos)
  const type = pngBuf.toString('ascii', pos + 4, pos + 8)
  const data = pngBuf.subarray(pos + 8, pos + 8 + length)
  pos += 12 + length // length (4) + type (4) + data (length) + crc (4)

  if (type === 'IHDR') {
    width = data.readUInt32BE(0)
    height = data.readUInt32BE(4)
    bitDepth = data[8]
    colorType = data[9]
  } else if (type === 'IDAT') {
    idatChunks.push(data)
  }
}

const compressedIdat = Buffer.concat(idatChunks)
const decompressed = zlib.inflateSync(compressedIdat)

// Deconstruct uncompressed scanlines:
// width x height, 4 bytes per pixel (RGBA, bitDepth 8, colorType 6)
// Each scanline has 1 filter byte + width * 4 bytes
const srcPixels = Buffer.alloc(width * height * 4)
const bytesPerPixel = 4
const stride = width * bytesPerPixel

let prevRow = Buffer.alloc(stride)

function paethPredictor(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

let srcOffset = 0
for (let y = 0; y < height; y++) {
  const filterType = decompressed[srcOffset++]
  const currentRow = Buffer.alloc(stride)

  for (let x = 0; x < stride; x++) {
    const rawVal = decompressed[srcOffset++]
    const a = x >= bytesPerPixel ? currentRow[x - bytesPerPixel] : 0
    const b = prevRow[x]
    const c = x >= bytesPerPixel ? prevRow[x - bytesPerPixel] : 0

    let reconVal = 0
    if (filterType === 0) {
      // None
      reconVal = rawVal
    } else if (filterType === 1) {
      // Sub
      reconVal = (rawVal + a) & 0xff
    } else if (filterType === 2) {
      // Up
      reconVal = (rawVal + b) & 0xff
    } else if (filterType === 3) {
      // Average
      reconVal = (rawVal + Math.floor((a + b) / 2)) & 0xff
    } else if (filterType === 4) {
      // Paeth
      reconVal = (rawVal + paethPredictor(a, b, c)) & 0xff
    }
    currentRow[x] = reconVal
  }

  currentRow.copy(srcPixels, y * stride)
  prevRow = currentRow
}

// Check sample pixels to understand colors and background
const cornerPixel = [srcPixels[0], srcPixels[1], srcPixels[2], srcPixels[3]]
console.log('Original dimensions:', width, height, 'BitDepth:', bitDepth, 'ColorType:', colorType)
console.log('Corner pixel (RGBA):', cornerPixel)

// Write SVG using Base64 data URI of the original PNG (256x256) embedded in <image>
const base64Png = pngBuf.toString('base64')
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <image width="${width}" height="${height}" href="data:image/png;base64,${base64Png}" />
</svg>
`

fs.writeFileSync(path.resolve(__dirname, '../public/favicon.svg'), svgContent, 'utf8')
console.log('Saved public/favicon.svg')

// Generate 180x180 apple-touch-icon.png with bilinear interpolation
const DST_W = 180
const DST_H = 180
const dstPixels = Buffer.alloc(DST_W * DST_H * 4)

for (let dy = 0; dy < DST_H; dy++) {
  // map dy to sy
  const sy = (dy + 0.5) * (height / DST_H) - 0.5
  const y0 = Math.max(0, Math.min(height - 1, Math.floor(sy)))
  const y1 = Math.max(0, Math.min(height - 1, y0 + 1))
  const fy = Math.max(0, Math.min(1, sy - y0))

  for (let dx = 0; dx < DST_W; dx++) {
    const sx = (dx + 0.5) * (width / DST_W) - 0.5
    const x0 = Math.max(0, Math.min(width - 1, Math.floor(sx)))
    const x1 = Math.max(0, Math.min(width - 1, x0 + 1))
    const fx = Math.max(0, Math.min(1, sx - x0))

    const dstIdx = (dy * DST_W + dx) * 4

    for (let c = 0; c < 4; c++) {
      const p00 = srcPixels[(y0 * width + x0) * 4 + c]
      const p10 = srcPixels[(y0 * width + x1) * 4 + c]
      const p01 = srcPixels[(y1 * width + x0) * 4 + c]
      const p11 = srcPixels[(y1 * width + x1) * 4 + c]

      const top = p00 * (1 - fx) + p10 * fx
      const bot = p01 * (1 - fx) + p11 * fx
      const val = Math.round(top * (1 - fy) + bot * fy)
      dstPixels[dstIdx + c] = Math.max(0, Math.min(255, val))
    }
  }
}

// Encode dstPixels into standard PNG (180x180 RGBA)
const dstScanlines = Buffer.alloc(DST_H * (1 + DST_W * 4))
for (let y = 0; y < DST_H; y++) {
  const lineOffset = y * (1 + DST_W * 4)
  dstScanlines[lineOffset] = 0 // Filter: None
  dstPixels.copy(dstScanlines, lineOffset + 1, y * DST_W * 4, (y + 1) * DST_W * 4)
}

const compressedDst = zlib.deflateSync(dstScanlines)

// Helper to create PNG chunk with CRC32
const crcTable = new Int32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1)
    else c = c >>> 1
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

function createChunk(type, data) {
  const buf = Buffer.alloc(12 + data.length)
  buf.writeUInt32BE(data.length, 0)
  buf.write(type, 4, 4, 'ascii')
  data.copy(buf, 8)
  const crc = crc32(buf.subarray(4, 8 + data.length))
  buf.writeInt32BE(crc, 8 + data.length)
  return buf
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const ihdrData = Buffer.alloc(13)
ihdrData.writeUInt32BE(DST_W, 0)
ihdrData.writeUInt32BE(DST_H, 4)
ihdrData[8] = 8 // bit depth: 8
ihdrData[9] = 6 // color type: RGBA
ihdrData[10] = 0
ihdrData[11] = 0
ihdrData[12] = 0

const ihdrChunk = createChunk('IHDR', ihdrData)
const idatChunk = createChunk('IDAT', compressedDst)
const iendChunk = createChunk('IEND', Buffer.alloc(0))

const finalApplePng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
const appleTouchPath = path.resolve(__dirname, '../public/apple-touch-icon.png')
fs.writeFileSync(appleTouchPath, finalApplePng)
console.log(
  `Successfully generated ${appleTouchPath} (${finalApplePng.length} bytes, ${DST_W}x${DST_H})`,
)

// Helper: Decodifica PNG simples (RGBA ou RGB com bitDepth 8)
function decodePngBuffer(pngBuffer) {
  let p = 8
  let w = 0
  let h = 0
  let depth = 0
  let cType = 0
  const chunks = []

  while (p < pngBuffer.length) {
    const len = pngBuffer.readUInt32BE(p)
    const t = pngBuffer.toString('ascii', p + 4, p + 8)
    const d = pngBuffer.subarray(p + 8, p + 8 + len)
    p += 12 + len

    if (t === 'IHDR') {
      w = d.readUInt32BE(0)
      h = d.readUInt32BE(4)
      depth = d[8]
      cType = d[9]
    } else if (t === 'IDAT') {
      chunks.push(d)
    }
  }

  const decomp = zlib.inflateSync(Buffer.concat(chunks))
  const bpp = cType === 6 ? 4 : cType === 2 ? 3 : 4
  const outStride = w * 4
  const inStride = w * bpp
  const rgbaPixels = Buffer.alloc(w * h * 4)

  let off = 0
  let prev = Buffer.alloc(inStride)

  for (let y = 0; y < h; y++) {
    const filter = decomp[off++]
    const curr = Buffer.alloc(inStride)

    for (let x = 0; x < inStride; x++) {
      const raw = decomp[off++]
      const a = x >= bpp ? curr[x - bpp] : 0
      const b = prev[x]
      const c = x >= bpp ? prev[x - bpp] : 0

      let recon = 0
      if (filter === 0) recon = raw
      else if (filter === 1) recon = (raw + a) & 0xff
      else if (filter === 2) recon = (raw + b) & 0xff
      else if (filter === 3) recon = (raw + Math.floor((a + b) / 2)) & 0xff
      else if (filter === 4) recon = (raw + paethPredictor(a, b, c)) & 0xff
      curr[x] = recon
    }

    // Copia para RGBA
    for (let px = 0; px < w; px++) {
      const dstIdx = y * outStride + px * 4
      if (cType === 6) {
        const srcIdx = px * 4
        rgbaPixels[dstIdx] = curr[srcIdx]
        rgbaPixels[dstIdx + 1] = curr[srcIdx + 1]
        rgbaPixels[dstIdx + 2] = curr[srcIdx + 2]
        rgbaPixels[dstIdx + 3] = curr[srcIdx + 3]
      } else if (cType === 2) {
        const srcIdx = px * 3
        rgbaPixels[dstIdx] = curr[srcIdx]
        rgbaPixels[dstIdx + 1] = curr[srcIdx + 1]
        rgbaPixels[dstIdx + 2] = curr[srcIdx + 2]
        rgbaPixels[dstIdx + 3] = 255
      }
    }
    prev = curr
  }

  return { width: w, height: h, pixels: rgbaPixels, bitDepth: depth, colorType: cType }
}

function resizeBilinear(srcPixels, sw, sh, dw, dh) {
  const dstPixels = Buffer.alloc(dw * dh * 4)
  for (let dy = 0; dy < dh; dy++) {
    const sy = (dy + 0.5) * (sh / dh) - 0.5
    const y0 = Math.max(0, Math.min(sh - 1, Math.floor(sy)))
    const y1 = Math.max(0, Math.min(sh - 1, y0 + 1))
    const fy = Math.max(0, Math.min(1, sy - y0))

    for (let dx = 0; dx < dw; dx++) {
      const sx = (dx + 0.5) * (sw / dw) - 0.5
      const x0 = Math.max(0, Math.min(sw - 1, Math.floor(sx)))
      const x1 = Math.max(0, Math.min(sw - 1, x0 + 1))
      const fx = Math.max(0, Math.min(1, sx - x0))

      const dstIdx = (dy * dw + dx) * 4

      for (let c = 0; c < 4; c++) {
        const p00 = srcPixels[(y0 * sw + x0) * 4 + c]
        const p10 = srcPixels[(y0 * sw + x1) * 4 + c]
        const p01 = srcPixels[(y1 * sw + x0) * 4 + c]
        const p11 = srcPixels[(y1 * sw + x1) * 4 + c]

        const top = p00 * (1 - fx) + p10 * fx
        const bot = p01 * (1 - fx) + p11 * fx
        const val = Math.round(top * (1 - fy) + bot * fy)
        dstPixels[dstIdx + c] = Math.max(0, Math.min(255, val))
      }
    }
  }
  return dstPixels
}

function encodePngRgba(pixels, dw, dh) {
  const scanlines = Buffer.alloc(dh * (1 + dw * 4))
  for (let y = 0; y < dh; y++) {
    const lineOffset = y * (1 + dw * 4)
    scanlines[lineOffset] = 0 // Filter: None
    pixels.copy(scanlines, lineOffset + 1, y * dw * 4, (y + 1) * dw * 4)
  }
  const compressed = zlib.deflateSync(scanlines, { level: 9 })
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(dw, 0)
  ihdr.writeUInt32BE(dh, 4)
  ihdr[8] = 8 // bit depth: 8
  ihdr[9] = 6 // color type: RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0)),
  ])
}

// 2) Redimensionamento do Logo (PageSpeed SEO): original 800px -> 560px de largura
const logoSource = path.resolve(__dirname, '../src/assets/logo-nova-800x200-b63d1.png')
const logoDest = path.resolve(__dirname, '../public/logo-horizontal.png')
const logo560Asset = path.resolve(__dirname, '../src/assets/logo-nova-560w.png')

if (fs.existsSync(logoSource)) {
  const logoBuf = fs.readFileSync(logoSource)
  const decodedLogo = decodePngBuffer(logoBuf)
  console.log(`Original logo: ${decodedLogo.width}x${decodedLogo.height}`)

  const targetWidth = 560
  const targetHeight = Math.round((decodedLogo.height / decodedLogo.width) * targetWidth)
  const resizedPixels = resizeBilinear(
    decodedLogo.pixels,
    decodedLogo.width,
    decodedLogo.height,
    targetWidth,
    targetHeight,
  )
  const logo560Png = encodePngRgba(resizedPixels, targetWidth, targetHeight)

  fs.writeFileSync(logo560Asset, logo560Png)
  console.log(`Saved 560w logo to ${logo560Asset} (${targetWidth}x${targetHeight})`)

  fs.copyFileSync(logo560Asset, logoDest)
  console.log(`Copied 560w logo to ${logoDest}`)
}
