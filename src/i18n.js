// i18n: 언어 감지 + 수동 토글 + {ko,en} 렌더 헬퍼 + UI 사전
// 콘텐츠 텍스트는 모두 { ko, en } 구조. UI 라벨은 아래 사전(DICT)에서.

const STORAGE_KEY = 'lang'
const SUPPORTED = ['ko', 'en']

// UI 라벨 사전 — 코드에 하드코딩하지 말고 여기서 꺼내 쓴다.
const DICT = {
  tab_home: { ko: 'home', en: 'home' },
  tab_world: { ko: 'world', en: 'world' },
  tab_timeline: { ko: 'timeline', en: 'timeline' },

  world_title: { ko: 'WORLD MAP', en: 'WORLD MAP' },
  world_subtitle: { ko: '여기까지의 여행', en: 'the journey so far' },
  world_hint: { ko: '지구를 눌러보세요', en: 'click the globe' },

  timeline_title: { ko: 'TIMELINE', en: 'TIMELINE' },
  timeline_subtitle: { ko: '여행의 기록', en: 'a record of the journey' },

  sheet_visited: { ko: 'VISITED', en: 'VISITED' },
  sheet_upcoming: { ko: 'UPCOMING', en: 'UPCOMING' },
  sheet_planned: { ko: 'PLANNED', en: 'PLANNED' },
  sheet_back: { ko: '← 목록', en: '← list' },
  sheet_empty: { ko: '곧 채워질 이야기', en: 'a story still to come' },

  status_visited: { ko: '다녀옴', en: 'visited' },
  status_upcoming: { ko: '곧 떠남', en: 'upcoming' },
  status_planned: { ko: '계획 중', en: 'planned' },

  loading: { ko: '걷는 중…', en: 'walking…' },
}

const listeners = new Set()
let current = detectInitial()

function detectInitial() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED.includes(saved)) return saved
  const nav = (navigator.language || 'en').toLowerCase()
  return nav.startsWith('ko') ? 'ko' : 'en'
}

export function getLang() {
  return current
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang) || lang === current) return
  current = lang
  localStorage.setItem(STORAGE_KEY, lang)
  document.documentElement.lang = lang
  listeners.forEach((fn) => fn(lang))
}

export function toggleLang() {
  setLang(current === 'ko' ? 'en' : 'ko')
}

// 콘텐츠 객체 { ko, en } → 현재 언어 문자열. 문자열을 넣으면 그대로 반환.
export function t(obj) {
  if (obj == null) return ''
  if (typeof obj === 'string') return obj
  return obj[current] ?? obj.en ?? obj.ko ?? ''
}

// UI 라벨 사전 조회
export function ui(key) {
  const entry = DICT[key]
  return entry ? entry[current] ?? entry.en : key
}

// 언어 변경 구독(페이지가 다시 그릴 수 있게). 해제 함수 반환.
export function onLangChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// 우상단 작은 KO/EN 토글 엘리먼트 생성
export function createLangToggle() {
  const el = document.createElement('button')
  el.className = 'lang-toggle'
  el.type = 'button'
  el.setAttribute('aria-label', 'language toggle')

  const render = () => {
    el.innerHTML = `
      <span class="${current === 'ko' ? 'on' : ''}">KO</span>
      <span class="sep">/</span>
      <span class="${current === 'en' ? 'on' : ''}">EN</span>`
  }
  render()
  el.addEventListener('click', toggleLang)
  onLangChange(render)
  return el
}
