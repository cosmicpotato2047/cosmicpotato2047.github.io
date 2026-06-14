// 픽셀 에셋 최적화: 표시 크기에 맞게 다운스케일 + 적응형 필터 + 최대 압축으로 재인코딩.
// 원본은 git 히스토리에 남아 있으니 안전. (한 번만 실행 권장 — 반복 실행 시 계속 줄어듦)
//
// 사용: npm run opt:images
import { readFileSync, writeFileSync } from 'node:fs'
import { deflateSync, inflateSync } from 'node:zlib'

const CRC = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c }
  return t
})()
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function paeth(a, b, c) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); if (pa <= pb && pa <= pc) return a; if (pb <= pc) return b; return c }

function decodePNG(buf) {
  let pos = 8, ihdr, idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), type = buf.toString('ascii', pos + 4, pos + 8)
    const d = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') ihdr = d; else if (type === 'IDAT') idat.push(d); else if (type === 'IEND') break
    pos += 12 + len
  }
  const width = ihdr.readUInt32BE(0), height = ihdr.readUInt32BE(4), bpp = 4, stride = width * bpp
  const raw = inflateSync(Buffer.concat(idat))
  const out = Buffer.alloc(height * stride)
  let prev = Buffer.alloc(stride)
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0
      let v = line[i]
      if (f === 1) v = (v + a) & 255; else if (f === 2) v = (v + b) & 255
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255; else if (f === 4) v = (v + paeth(a, b, c)) & 255
      cur[i] = v
    }
    cur.copy(out, y * stride); prev = cur
  }
  return { width, height, data: out }
}

// 면적 평균 다운스케일 (알파 프리멀티플라이로 가장자리 보존)
function downscale(src, dw, dh) {
  const { width: sw, height: sh, data: sd } = src
  const out = Buffer.alloc(dw * dh * 4)
  for (let y = 0; y < dh; y++) {
    const sy0 = Math.floor((y * sh) / dh), sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) * sh) / dh))
    for (let x = 0; x < dw; x++) {
      const sx0 = Math.floor((x * sw) / dw), sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) * sw) / dw))
      let r = 0, g = 0, b = 0, a = 0, n = 0
      for (let yy = sy0; yy < sy1; yy++) for (let xx = sx0; xx < sx1; xx++) {
        const i = (yy * sw + xx) * 4, af = sd[i + 3] / 255
        r += sd[i] * af; g += sd[i + 1] * af; b += sd[i + 2] * af; a += sd[i + 3]; n++
      }
      const oi = (y * dw + x) * 4, avgA = a / n
      if (avgA < 0.5) { out[oi] = out[oi + 1] = out[oi + 2] = out[oi + 3] = 0 }
      else {
        const af = avgA / 255
        out[oi] = Math.min(255, Math.round(r / n / af))
        out[oi + 1] = Math.min(255, Math.round(g / n / af))
        out[oi + 2] = Math.min(255, Math.round(b / n / af))
        out[oi + 3] = Math.round(avgA)
      }
    }
  }
  return { width: dw, height: dh, data: out }
}

// 적응형 필터 + level 9
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6
  const stride = w * 4, bpp = 4
  const raw = Buffer.alloc((stride + 1) * h)
  let prev = Buffer.alloc(stride)
  for (let y = 0; y < h; y++) {
    const cur = rgba.subarray(y * stride, y * stride + stride)
    let best = null
    for (let f = 0; f < 5; f++) {
      const o = Buffer.alloc(stride)
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0
        let v = cur[i]
        if (f === 1) v = (cur[i] - a) & 255; else if (f === 2) v = (cur[i] - b) & 255
        else if (f === 3) v = (cur[i] - ((a + b) >> 1)) & 255; else if (f === 4) v = (cur[i] - paeth(a, b, c)) & 255
        o[i] = v
      }
      let sum = 0; for (let i = 0; i < stride; i++) sum += o[i] < 128 ? o[i] : 256 - o[i]
      if (!best || sum < best.sum) best = { f, o, sum }
    }
    raw[y * (stride + 1)] = best.f
    best.o.copy(raw, y * (stride + 1) + 1)
    prev = cur
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// 파일별 목표 크기 (표시 크기 × 레티나 여유)
const TARGETS = {
  'asteroid.png': 420,
  'globe.png': 360,
  'littlep.png': 256,
  'fox.png': 180,
  'rose.png': 180,
}

for (const [name, size] of Object.entries(TARGETS)) {
  const url = new URL('../public/' + name, import.meta.url)
  const before = readFileSync(url)
  const img = decodePNG(before)
  if (img.width <= size) { console.log('  • skip', name, `(이미 ${img.width}px)`); continue }
  const small = downscale(img, size, size)
  const out = encodePNG(size, size, small.data)
  writeFileSync(url, out)
  console.log('  ✓', name, `${img.width}→${size}px`, `${(before.length / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`)
}
console.log('완료. og.png는 npm run gen:og 로 다시 생성하세요(globe/littlep 변경됨).')
