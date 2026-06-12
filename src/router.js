// 해시 기반 라우터. GitHub Pages는 서버 라우팅이 없으므로 해시(#home/#world/#timeline).
import { renderHome } from './pages/home.js'
import { renderWorld } from './pages/world.js'
import { renderTimeline } from './pages/timeline.js'

const ROUTES = {
  home: renderHome,
  world: renderWorld,
  timeline: renderTimeline,
}
const DEFAULT = 'home'

const changeListeners = new Set()
let cleanup = null

export function currentRoute() {
  const hash = location.hash.replace(/^#/, '')
  return ROUTES[hash] ? hash : DEFAULT
}

export function onRouteChange(fn) {
  changeListeners.add(fn)
  return () => changeListeners.delete(fn)
}

function mount(container) {
  // 이전 페이지 정리(애니메이션/리스너 해제)
  if (typeof cleanup === 'function') cleanup()
  const route = currentRoute()
  container.innerHTML = ''
  container.dataset.route = route
  cleanup = ROUTES[route](container) || null
  container.scrollTop = 0
  changeListeners.forEach((fn) => fn(route))
}

export function initRouter(container) {
  if (!location.hash) location.hash = '#' + DEFAULT
  window.addEventListener('hashchange', () => mount(container))
  mount(container)
}

export function navigate(route) {
  if (currentRoute() === route) return
  location.hash = '#' + route
}
