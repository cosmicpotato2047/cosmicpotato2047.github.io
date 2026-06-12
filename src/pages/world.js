// World (#world) — 픽셀 우주. 지구 감상용 + 탭하면 국가 리스트 시트.
import { createPixelGlobe } from '../components/pixelGlobe.js'
import { createSheet } from '../components/sheet.js'
import { ui, onLangChange } from '../i18n.js'

export function renderWorld(container) {
  const page = document.createElement('div')
  page.className = 'world'
  container.appendChild(page)

  // 별이 박힌 정적 배경 + 미세 트윙클
  const sky = document.createElement('div')
  sky.className = 'world__sky'
  sky.appendChild(makeStars())
  page.appendChild(sky)

  const head = document.createElement('header')
  head.className = 'world__head'
  page.appendChild(head)

  const sheet = createSheet()
  const globe = createPixelGlobe(() => {
    page.classList.add('world--sheet-open')
    sheet.open()
  })
  // 시트 닫히면 hint 다시 보이게
  const observer = new MutationObserver(() => {
    if (!sheet.el.classList.contains('sheet-root--open')) {
      page.classList.remove('world--sheet-open')
    }
  })
  observer.observe(sheet.el, { attributes: true, attributeFilter: ['class'] })

  page.appendChild(globe)

  const hint = document.createElement('p')
  hint.className = 'world__hint'
  page.appendChild(hint)

  page.appendChild(sheet.el)

  const draw = () => {
    head.innerHTML = `
      <h1 class="world__title">${ui('world_title')}</h1>
      <p class="world__sub">${ui('world_subtitle')}</p>`
    hint.textContent = ui('world_hint')
  }
  draw()
  const off = onLangChange(draw)

  return () => {
    off()
    observer.disconnect()
  }
}

// 정적 별밭(결정론적 배치) — 성능 우선, 트윙클은 CSS
function makeStars() {
  const host = document.createElement('div')
  host.className = 'world__stars'
  const n = 90
  let html = ''
  for (let i = 0; i < n; i++) {
    const x = rand(i * 1.7) * 100
    const y = rand(i * 2.9) * 100
    const s = rand(i * 4.1) > 0.85 ? 2 : 1
    const o = 0.3 + rand(i * 3.3) * 0.7
    const d = (rand(i * 5.5) * 4).toFixed(2)
    html += `<i style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${s}px;height:${s}px;opacity:${o.toFixed(
      2
    )};animation-delay:${d}s"></i>`
  }
  host.innerHTML = html
  return host
}

function rand(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}
