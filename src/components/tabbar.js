// 하단 고정 탭바. 3탭(home/world/timeline). 활성 탭 강조 + 페이지 톤에 맞춰 배경 전환.
import { navigate, currentRoute, onRouteChange } from '../router.js'
import { ui, onLangChange } from '../i18n.js'

const TABS = [
  { id: 'home', icon: iconHome },
  { id: 'world', icon: iconWorld },
  { id: 'timeline', icon: iconTimeline },
]

// World는 어두운 톤, Home/Timeline은 밝은 종이 톤
const DARK_ROUTES = new Set(['world'])

export function mountTabbar(nav) {
  const render = () => {
    const route = currentRoute()
    nav.classList.toggle('tabbar--dark', DARK_ROUTES.has(route))
    nav.innerHTML = ''
    TABS.forEach((tab) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'tab' + (route === tab.id ? ' tab--active' : '')
      btn.setAttribute('aria-label', tab.id)
      btn.innerHTML = `${tab.icon()}<span class="tab__label">${ui('tab_' + tab.id)}</span>`
      btn.addEventListener('click', () => navigate(tab.id))
      nav.appendChild(btn)
    })
  }
  render()
  onRouteChange(render)
  onLangChange(render)
}

// --- inline SVG 아이콘 (24x24, currentColor) ---
function iconHome() {
  return `<svg class="tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`
}
function iconWorld() {
  return `<svg class="tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/></svg>`
}
function iconTimeline() {
  return `<svg class="tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"/><circle cx="6" cy="8" r="1.6"/><circle cx="6" cy="16" r="1.6"/><path d="M10 8h9"/><path d="M10 16h9"/></svg>`
}
