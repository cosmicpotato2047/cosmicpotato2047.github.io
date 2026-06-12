// 공유 썸네일(og.png, 1200×630) 생성기.
// 실제 픽셀 에셋(globe.png, littlep.png)을 우주 배경 위에 합성하고,
// 픽셀 폰트로 이름/태그라인을 그린다. → public/og.png
//
// 사용: npm run gen:og
import { readFileSync, writeFileSync } from 'node:fs'
import { deflateSync, inflateSync } from 'node:zlib'

// ---------- PNG 인코더 ----------
const CRC = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

// ---------- PNG 디코더 (8-bit RGBA, non-interlaced) ----------
function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}
function decodePNG(buf) {
  let pos = 8, ihdr, idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') ihdr = data
    else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    pos += 12 + len
  }
  const width = ihdr.readUInt32BE(0), height = ihdr.readUInt32BE(4)
  const bpp = 4, stride = width * bpp
  const raw = inflateSync(Buffer.concat(idat))
  const out = Buffer.alloc(height * stride)
  let prev = Buffer.alloc(stride)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const b = prev[i]
      const c = i >= bpp ? prev[i - bpp] : 0
      let v = line[i]
      if (filter === 1) v = (v + a) & 255
      else if (filter === 2) v = (v + b) & 255
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255
      else if (filter === 4) v = (v + paeth(a, b, c)) & 255
      cur[i] = v
    }
    cur.copy(out, y * stride)
    prev = cur
  }
  return { width, height, data: out }
}

// ---------- 캔버스 ----------
function canvas(w, h) {
  const data = Buffer.alloc(w * h * 4)
  return {
    w, h, data,
    set(x, y, [r, g, b, a = 255]) {
      if (x < 0 || y < 0 || x >= w || y >= h) return
      const i = (y * w + x) * 4
      const af = a / 255
      data[i] = Math.round(r * af + data[i] * (1 - af))
      data[i + 1] = Math.round(g * af + data[i + 1] * (1 - af))
      data[i + 2] = Math.round(b * af + data[i + 2] * (1 - af))
      data[i + 3] = 255
    },
  }
}
// 디코딩한 이미지를 nearest-neighbor로 스케일 + 알파 합성
function blit(dst, src, dx, dy, dw, dh) {
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(src.height - 1, Math.floor((y * src.height) / dh))
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(src.width - 1, Math.floor((x * src.width) / dw))
      const si = (sy * src.width + sx) * 4
      const a = src.data[si + 3]
      if (a <= 2) continue
      dst.set(dx + x, dy + y, [src.data[si], src.data[si + 1], src.data[si + 2], a])
    }
  }
}

// ---------- 픽셀 폰트 (5×7) ----------
const G = {
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#.#.#', '#..##', '#...#', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  e: ['.....', '.....', '.###.', '#...#', '#####', '#....', '.###.'],
  x: ['.....', '.....', '#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  p: ['.....', '.....', '####.', '#...#', '####.', '#....', '#....'],
  r: ['.....', '.....', '#.##.', '##..#', '#....', '#....', '#....'],
  i: ['..#..', '.....', '.##..', '..#..', '..#..', '..#..', '.###.'],
  n: ['.....', '.....', '####.', '#...#', '#...#', '#...#', '#...#'],
  c: ['.....', '.....', '.###.', '#....', '#....', '#....', '.###.'],
  o: ['.....', '.....', '.###.', '#...#', '#...#', '#...#', '.###.'],
  l: ['.##..', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  t: ['..#..', '..#..', '#####', '..#..', '..#..', '..#..', '..##.'],
}
function textWidth(str, cell) {
  return str.length * 6 * cell - cell // 5 + 1 spacing, 마지막 spacing 제외
}
function drawText(c, str, x, y, cell, color) {
  let cx = x
  for (const ch of str) {
    const g = G[ch] || G[' ']
    for (let row = 0; row < 7; row++)
      for (let col = 0; col < 5; col++)
        if (g[row][col] === '#')
          for (let py = 0; py < cell; py++)
            for (let px = 0; px < cell; px++) c.set(cx + col * cell + px, y + row * cell + py, color)
    cx += 6 * cell
  }
}

// ---------- 합성 ----------
const W = 1200, H = 630
const c = canvas(W, H)
const SPACE = [7, 10, 26], SPACE2 = [18, 26, 62]

// 배경: 위→중앙 살짝 밝아지는 우주
for (let y = 0; y < H; y++) {
  const t = 1 - Math.abs(y - H * 0.42) / H
  const r = Math.round(SPACE[0] + (SPACE2[0] - SPACE[0]) * t)
  const g = Math.round(SPACE[1] + (SPACE2[1] - SPACE[1]) * t)
  const b = Math.round(SPACE[2] + (SPACE2[2] - SPACE[2]) * t)
  for (let x = 0; x < W; x++) c.set(x, y, [r, g, b, 255])
}
// 별 (결정론적)
for (let i = 0; i < 220; i++) {
  const rx = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
  const ry = Math.abs(Math.sin(i * 78.233) * 12543.123) % 1
  const x = Math.floor(rx * W), y = Math.floor(ry * H)
  const s = (Math.abs(Math.sin(i * 3.3)) > 0.85) ? 2 : 1
  const o = 90 + Math.floor(Math.abs(Math.sin(i * 5.1)) * 150)
  for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) c.set(x + dx, y + dy, [255, 255, 255, o])
}

const globe = decodePNG(readFileSync(new URL('../public/globe.png', import.meta.url)))
const char = decodePNG(readFileSync(new URL('../public/littlep.png', import.meta.url)))

// 지구: 왼쪽 중앙
const GD = 380
const gx = 95, gy = (H - GD) / 2 + 15
blit(c, globe, gx, gy, GD, GD)
// 캐릭터: 지구 정상부 위
const CD = 145
blit(c, char, gx + GD / 2 - CD / 2, gy - CD + 42, CD, CD)

// 텍스트: 오른쪽 (1200폭 안에 들어오게 cell 크기 조정)
const cream = [251, 250, 247, 255], amber = [217, 154, 58, 255]
drawText(c, 'CHAN LEE', 530, 250, 12, cream)
drawText(c, 'experience collector', 532, 362, 5, amber)

writeFileSync(new URL('../public/og.png', import.meta.url), encodePNG(W, H, c.data))
console.log('og.png 생성 완료 (1200×630)')
