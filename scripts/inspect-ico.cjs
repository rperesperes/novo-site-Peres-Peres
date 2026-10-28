const fs = require('fs')
const path = require('path')

const icoPath = path.resolve(__dirname, '../public/favicon.ico')
const buf = fs.readFileSync(icoPath)

console.log('Total file size:', buf.length)
console.log(
  'ICO Magic:',
  buf.readUInt16LE(0),
  'Type (1=ico):',
  buf.readUInt16LE(2),
  'Count:',
  buf.readUInt16LE(4),
)

const count = buf.readUInt16LE(4)
for (let i = 0; i < count; i++) {
  const offset = 6 + i * 16
  const width = buf[offset] || 256
  const height = buf[offset + 1] || 256
  const colors = buf[offset + 2]
  const planes = buf.readUInt16LE(offset + 4)
  const bpp = buf.readUInt16LE(offset + 6)
  const size = buf.readUInt32LE(offset + 8)
  const imgOffset = buf.readUInt32LE(offset + 12)

  // Check if PNG or BMP
  const isPng =
    buf[imgOffset] === 0x89 &&
    buf[imgOffset + 1] === 0x50 &&
    buf[imgOffset + 2] === 0x4e &&
    buf[imgOffset + 3] === 0x47
  console.log(
    `Image ${i}: ${width}x${height}, bpp: ${bpp}, size: ${size}, offset: ${imgOffset}, isPng: ${isPng}`,
  )
}
