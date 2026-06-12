// 픽셀 에셋 플레이스홀더 생성기.
// Chan이 실제 픽셀 아트(globe/littlep/fox/rose/아이콘/avatar)를 만들기 전까지
// 사이트가 깨지지 않도록 같은 경로/파일명에 간단한 PNG를 깔아둔다.
// 실제 에셋으로 교체 = public/ 에 같은 이름으로 덮어쓰기 (CONTENT_GUIDE 참고).
//
// 사용: npm run gen:placeholders
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

// 이미 있는 파일은 건드리지 않는다(Chan의 실제 에셋 보호). 없는 것만 채움.
function writeIfMissing(url, buf, label) {
  if (existsSync(url)) {
    console.log('  • skip', label, '(이미 존재 — 실제 에셋 보호)')
    return
  }
  writeFileSync(url, buf)
  console.log('  ✓', label, typeof buf === 'string' ? '' : `(${buf.length}b)`)
}

// --- 최소 PNG 인코더 (RGBA, 무압축 필터 0) ---
const CRC_TABLE = (() => {
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
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  // 10,11,12 = 0 (deflate / adaptive / no interlace)
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = deflateSync(raw)
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- 그리기 헬퍼 (작은 캔버스에 픽셀 단위로) ---
function canvas(w, h) {
  const data = Buffer.alloc(w * h * 4) // 투명
  const set = (x, y, [r, g, b, a = 255]) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const i = (y * w + x) * 4
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = a
  }
  const fill = (color) => {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) set(x, y, color)
  }
  const disc = (cx, cy, rad, color) => {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const dx = x - cx
        const dy = y - cy
        if (dx * dx + dy * dy <= rad * rad) set(x, y, color)
      }
  }
  const rect = (x0, y0, ww, hh, color) => {
    for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + ww; x++) set(x, y, color)
  }
  return { w, h, data, set, fill, disc, rect, png: () => encodePNG(w, h, data) }
}

const OUT = new URL('../public/', import.meta.url)
const ICONS = new URL('../public/icons/', import.meta.url)
mkdirSync(OUT, { recursive: true })
mkdirSync(ICONS, { recursive: true })

function save(relPath, buf) {
  writeIfMissing(new URL(relPath, OUT), buf, relPath)
}

console.log('Generating placeholder assets…')

// globe.png — 픽셀 지구 (64x64)
{
  const c = canvas(64, 64)
  c.disc(32, 32, 30, [54, 90, 150, 255]) // 바다
  // 대충 대륙
  c.disc(24, 26, 9, [110, 150, 90, 255])
  c.disc(42, 38, 8, [110, 150, 90, 255])
  c.disc(36, 18, 5, [120, 160, 95, 255])
  c.disc(20, 44, 4, [120, 160, 95, 255])
  save('globe.png', c.png())
}

// 캐릭터 littlep.png (24x32) — 망토 두른 작은 사람
{
  const c = canvas(24, 32)
  c.disc(12, 8, 5, [240, 214, 170, 255]) // 머리
  c.rect(10, 2, 4, 3, [210, 170, 60, 255]) // 머리카락 한 줌
  c.rect(7, 13, 10, 13, [90, 110, 170, 255]) // 망토
  c.rect(9, 26, 2, 5, [60, 50, 45, 255]) // 다리
  c.rect(13, 26, 2, 5, [60, 50, 45, 255])
  save('littlep.png', c.png())
}

// fox.png (24x24)
{
  const c = canvas(24, 24)
  c.disc(12, 14, 8, [200, 110, 55, 255]) // 몸
  c.set(7, 6, [200, 110, 55, 255]) // 귀
  c.rect(6, 5, 3, 4, [200, 110, 55, 255])
  c.rect(15, 5, 3, 4, [200, 110, 55, 255])
  c.disc(12, 13, 4, [245, 235, 220, 255]) // 얼굴
  c.set(10, 12, [40, 30, 25, 255]) // 눈
  c.set(14, 12, [40, 30, 25, 255])
  save('fox.png', c.png())
}

// rose.png (20x24)
{
  const c = canvas(20, 24)
  c.disc(10, 7, 5, [200, 70, 80, 255]) // 꽃
  c.disc(10, 7, 2, [230, 120, 130, 255])
  c.rect(9, 11, 2, 11, [90, 130, 80, 255]) // 줄기
  c.rect(4, 15, 5, 2, [90, 130, 80, 255]) // 잎
  c.rect(11, 17, 5, 2, [90, 130, 80, 255])
  save('rose.png', c.png())
}

// avatar.png (96x96) — 종이톤 원형 placeholder
{
  const c = canvas(96, 96)
  c.disc(48, 48, 47, [244, 237, 225, 255])
  c.disc(48, 40, 16, [200, 180, 150, 255]) // 머리
  c.disc(48, 84, 28, [200, 180, 150, 255]) // 어깨
  save('avatar.png', c.png())
}

// og.png (120x63 → 작게, 공유 썸네일 placeholder)
{
  const c = canvas(120, 63)
  c.fill([7, 10, 26, 255])
  c.disc(40, 38, 16, [54, 90, 150, 255])
  for (let i = 0; i < 40; i++) {
    const x = (Math.sin(i * 12.9) * 1000) % 120
    const y = (Math.cos(i * 7.7) * 1000) % 63
    c.set(Math.abs(Math.floor(x)), Math.abs(Math.floor(y)), [255, 255, 255, 200])
  }
  save('og.png', c.png())
}

// 링크 아이콘 3종 (32x32) — writing / photo / video
function iconBase(accent) {
  const c = canvas(32, 32)
  c.rect(2, 2, 28, 28, [...accent, 255])
  c.rect(5, 5, 22, 22, [251, 250, 247, 255])
  return c
}
{
  // writing: 줄
  const c = iconBase([110, 90, 70])
  c.rect(9, 10, 14, 2, [110, 90, 70, 255])
  c.rect(9, 15, 14, 2, [110, 90, 70, 255])
  c.rect(9, 20, 9, 2, [110, 90, 70, 255])
  writeIfMissing(new URL('writing.png', ICONS), c.png(), 'icons/writing.png')
}
{
  // photo: 동그라미(렌즈)
  const c = iconBase([90, 120, 130])
  c.rect(8, 11, 16, 12, [90, 120, 130, 255])
  c.rect(10, 13, 12, 8, [251, 250, 247, 255])
  c.disc(16, 17, 3, [90, 120, 130, 255])
  writeIfMissing(new URL('photo.png', ICONS), c.png(), 'icons/photo.png')
}
{
  // video: 삼각형(재생)
  const c = iconBase([180, 70, 70])
  for (let i = 0; i < 9; i++) c.rect(13, 11 + i, Math.max(1, 9 - i), 1, [180, 70, 70, 255])
  writeIfMissing(new URL('video.png', ICONS), c.png(), 'icons/video.png')
}

// favicon.svg (벡터 — 작은 지구)
{
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#070a1a"/>
  <circle cx="16" cy="16" r="9" fill="#365a96"/>
  <circle cx="12" cy="13" r="3" fill="#6e966a"/>
  <circle cx="20" cy="19" r="2.5" fill="#6e966a"/>
</svg>\n`
  writeIfMissing(new URL('favicon.svg', OUT), svg, 'favicon.svg')
}

console.log('Done. (실제 에셋으로 public/ 에 덮어쓰면 교체됨)')
