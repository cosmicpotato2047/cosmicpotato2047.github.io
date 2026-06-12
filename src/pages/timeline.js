// Timeline (#timeline) — 종이 일지. 연도 내림차순 아코디언. timeline.json에서 렌더.
import timeline from '../data/timeline.json'
import { t, ui, onLangChange } from '../i18n.js'

export function renderTimeline(container) {
  const page = document.createElement('div')
  page.className = 'timeline'
  container.appendChild(page)

  // 펼침 상태를 연도별로 보존(언어 전환/리렌더 시 유지)
  const years = [...timeline].sort((a, b) => b.year - a.year)
  const openState = new Map(years.map((y) => [y.year, !!y.open_by_default]))

  const draw = () => {
    page.innerHTML = `
      <header class="page-head">
        <h1 class="page-head__title">${ui('timeline_title')}</h1>
        <p class="page-head__sub">${ui('timeline_subtitle')}</p>
      </header>
      <div class="timeline__track">
        ${years
          .map((y, i) => {
            const open = openState.get(y.year)
            return `
            <section class="tl-year ${open ? 'tl-year--open' : ''} ${
              i === 0 ? 'tl-year--latest' : ''
            }" data-year="${y.year}">
              <button class="tl-year__head" type="button" aria-expanded="${open}">
                <span class="tl-year__dot"></span>
                <span class="tl-year__label">${y.year}</span>
                <span class="tl-year__chev" aria-hidden="true">▾</span>
              </button>
              <div class="tl-year__body">
                <div class="tl-year__entries">
                  ${y.entries.map(renderEntry).join('')}
                </div>
              </div>
            </section>`
          })
          .join('')}
      </div>
    `

    page.querySelectorAll('.tl-year__head').forEach((head) => {
      head.addEventListener('click', () => {
        const section = head.closest('.tl-year')
        const year = Number(section.dataset.year)
        const next = !openState.get(year)
        openState.set(year, next)
        section.classList.toggle('tl-year--open', next)
        head.setAttribute('aria-expanded', String(next))
      })
    })
  }

  draw()
  const off = onLangChange(draw)
  return () => off()
}

function renderEntry(e) {
  const tags = (e.tags || [])
    .map((tag) => `<span class="tl-tag">${tag}</span>`)
    .join('')
  const link = e.url
    ? `<a class="tl-entry__link" href="${e.url}" target="_blank" rel="noopener noreferrer" aria-label="open">↗</a>`
    : ''
  return `
    <article class="tl-entry">
      <div class="tl-entry__main">
        <h3 class="tl-entry__title">${t(e.title)}</h3>
        <p class="tl-entry__desc">${t(e.desc)}</p>
        <div class="tl-entry__tags">${tags}</div>
      </div>
      ${link}
    </article>`
}
