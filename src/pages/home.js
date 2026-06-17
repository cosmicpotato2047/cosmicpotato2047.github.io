// Home (#home) — 종이→우주 그라데이션 명함. 전부 profile.json에서 렌더.
import profile from '../data/profile.json'
import { t, getLang, onLangChange } from '../i18n.js'

export function renderHome(container) {
  const page = document.createElement('div')
  page.className = 'home'
  container.appendChild(page)

  const draw = () => {
    page.innerHTML = `
      <section class="home__card">
        <img class="home__avatar" src="${profile.avatar}" alt="${profile.name_en}"
             onerror="this.classList.add('img--missing')" />

        <h1 class="home__name">${getLang() === 'ko' ? profile.name_ko : profile.name_en}</h1>
        <p class="home__name-en">${getLang() === 'ko' ? profile.name_en : profile.name_ko}</p>

        <p class="home__tagline">${t(profile.tagline)}</p>

        <div class="home__links">
          ${profile.links
            .map(
              (l) => `
            <a class="home__link" href="${l.url}" target="_blank" rel="noopener noreferrer"
               aria-label="${l.type}">
              <img src="${l.icon}" alt="${l.type}" onerror="this.classList.add('img--missing')" />
            </a>`
            )
            .join('')}
        </div>

        <p class="home__intro">${t(profile.intro)}</p>
      </section>

      <footer class="home__footer" aria-hidden="true">
        <div class="home__stars"></div>
        <div class="home__planet">
          <img class="home__planet-bg" src="/asteroid.png" alt="" loading="lazy" decoding="async" onerror="this.classList.add('img--missing')" />
          <img class="home__rose" src="/rose.png" alt="" loading="lazy" decoding="async" onerror="this.classList.add('img--missing')" />
          <img class="home__fox" src="/fox.png" alt="" loading="lazy" decoding="async" onerror="this.classList.add('img--missing')" />
        </div>
        <p class="home__credit">inspired by Le Petit Prince</p>
      </footer>
    `
    sprinkleStars(page.querySelector('.home__stars'))
  }

  draw()
  const off = onLangChange(draw)
  return () => off()
}

// footer 별: 아래로 갈수록 촘촘하게(시선을 world 탭으로 유도)
function sprinkleStars(host) {
  if (!host) return
  const n = 36
  let html = ''
  for (let i = 0; i < n; i++) {
    // y를 제곱 분포로 깔아 아래쪽에 더 많이
    const y = Math.pow((i + 1) / n, 0.6) * 100
    const x = pseudoRandom(i * 7.3) * 100
    const s = 1 + Math.round(pseudoRandom(i * 3.1) * 2)
    const o = 0.25 + pseudoRandom(i * 5.7) * 0.6
    const d = (pseudoRandom(i * 2.2) * 3).toFixed(2)
    html += `<i style="left:${x.toFixed(1)}%;top:${y.toFixed(
      1
    )}%;width:${s}px;height:${s}px;opacity:${o.toFixed(2)};animation-delay:${d}s"></i>`
  }
  host.innerHTML = html
}

// 결정론적 의사난수(빌드마다 동일 배치)
function pseudoRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}
