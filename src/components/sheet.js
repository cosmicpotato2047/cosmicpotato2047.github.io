// 하단 슬라이드업 시트: 국가 리스트 ↔ 상세 전환.
// 드래그 핸들 + status별 섹션. 스와이프 다운/배경 탭으로 닫힘.
import countries from '../data/countries.json'
import { t, ui, getLang, onLangChange } from '../i18n.js'

const PROJECT_ICON = {
  ebook: '/icons/book-open.svg',
  youtube: '/icons/youtube.svg',
  instagram: '/icons/instagram.svg',
  other: '/icons/book-open.svg',
}

export function createSheet() {
  const root = document.createElement('div')
  root.className = 'sheet-root'
  root.innerHTML = `
    <div class="sheet__scrim"></div>
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet__handle"></div>
      <div class="sheet__body"></div>
    </div>
  `
  const scrim = root.querySelector('.sheet__scrim')
  const sheet = root.querySelector('.sheet')
  const body = root.querySelector('.sheet__body')
  const handle = root.querySelector('.sheet__handle')

  let isOpen = false

  const open = () => {
    drawList()
    root.classList.add('sheet-root--open')
    isOpen = true
  }
  const close = () => {
    root.classList.remove('sheet-root--open')
    isOpen = false
  }

  scrim.addEventListener('click', close)

  // 핸들 스와이프 다운으로 닫기
  let startY = null
  const onDown = (y) => (startY = y)
  const onMove = (y) => {
    if (startY == null) return
    const dy = Math.max(0, y - startY)
    sheet.style.transform = `translateY(${dy}px)`
  }
  const onUp = (y) => {
    if (startY == null) return
    const dy = y - startY
    sheet.style.transform = ''
    if (dy > 80) close()
    startY = null
  }
  handle.addEventListener('touchstart', (e) => onDown(e.touches[0].clientY), { passive: true })
  handle.addEventListener('touchmove', (e) => onMove(e.touches[0].clientY), { passive: true })
  handle.addEventListener('touchend', (e) => onUp(e.changedTouches[0].clientY))
  handle.addEventListener('mousedown', (e) => onDown(e.clientY))
  window.addEventListener('mousemove', (e) => startY != null && onMove(e.clientY))
  window.addEventListener('mouseup', (e) => startY != null && onUp(e.clientY))

  function drawList() {
    const groups = {
      visited: countries.filter((c) => c.status === 'visited'),
      upcoming: countries.filter((c) => c.status === 'upcoming'),
      planned: countries.filter((c) => c.status === 'planned'),
    }
    body.innerHTML = `
      ${section('visited', groups.visited, cardCountry)}
      ${section('upcoming', groups.upcoming, cardCountry)}
      ${section('planned', groups.planned, pillCountry, true)}
    `
    body.scrollTop = 0
    body.querySelectorAll('[data-country]').forEach((node) => {
      node.addEventListener('click', () => drawDetail(node.dataset.country))
    })
  }

  function drawDetail(id) {
    const c = countries.find((x) => x.id === id)
    if (!c) return
    const projects = c.projects && c.projects.length
      ? c.projects
          .map(
            (p) => `
        <a class="proj" ${p.url ? `href="${p.url}" target="_blank" rel="noopener noreferrer"` : ''}>
          <img class="proj__icon" src="${PROJECT_ICON[p.type] || PROJECT_ICON.other}" alt=""
               onerror="this.classList.add('img--missing')" />
          <span class="proj__title">${t(p.title)}</span>
          ${p.url ? '<span class="proj__go">↗</span>' : ''}
        </a>`
          )
          .join('')
      : `<p class="sheet__empty">${ui('sheet_empty')}</p>`

    body.innerHTML = `
      <button class="sheet__back" type="button">${ui('sheet_back')}</button>
      <div class="detail">
        <div class="detail__head">
          <h2 class="detail__name">${pickName(c)}</h2>
          <span class="pill pill--${c.status}">${ui('status_' + c.status)}</span>
        </div>
        <p class="detail__period">${t(c.period) || ''}</p>
        <div class="detail__projects">${projects}</div>
      </div>
    `
    body.scrollTop = 0
    body.querySelector('.sheet__back').addEventListener('click', drawList)
  }

  function section(key, list, renderItem, isPills = false) {
    if (!list.length) return ''
    return `
      <div class="sheet__section">
        <h3 class="sheet__section-title sheet__section-title--${key}">${ui('sheet_' + key)}</h3>
        <div class="${isPills ? 'pill-group' : 'card-group'}">
          ${list.map(renderItem).join('')}
        </div>
      </div>`
  }

  function cardCountry(c) {
    const summary = c.projects && c.projects.length ? t(c.projects[0].title) : ''
    return `
      <button class="ccard ccard--${c.status}" data-country="${c.id}" type="button">
        <span class="ccard__chev" aria-hidden="true">›</span>
        <span class="ccard__name">${pickName(c)}</span>
        <span class="ccard__period">${t(c.period) || ''}</span>
        ${summary ? `<span class="ccard__summary">${summary}</span>` : ''}
      </button>`
  }

  function pillCountry(c) {
    return `<button class="cpill" data-country="${c.id}" type="button">${pickName(c)}</button>`
  }

  function pickName(c) {
    // 언어에 따라 표시명 선택(ko면 name_ko, 아니면 영문 name) + 국기/이모지 병기
    const name = getLang() === 'ko' ? c.name_ko || c.name : c.name
    return (c.emoji ? c.emoji + ' ' : '') + name
  }

  // 언어 전환 시 열려 있으면 다시 그림
  onLangChange(() => {
    if (isOpen) drawList()
  })

  return { el: root, open, close }
}
