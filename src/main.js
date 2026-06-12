import './style.css'
import { initRouter } from './router.js'
import { mountTabbar } from './components/tabbar.js'
import { createLangToggle, getLang } from './i18n.js'
import { showLoader } from './components/loader.js'

document.documentElement.lang = getLang()

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="device">
    <main class="content" id="content"></main>
    <nav class="tabbar" id="tabbar"></nav>
  </div>
`

const device = app.querySelector('.device')
const content = app.querySelector('#content')

// 우상단 언어 토글
device.appendChild(createLangToggle())

// 첫 진입 로딩(캐릭터 걷기) — 짧게 보여주고 라우터 마운트
const hideLoader = showLoader(device)

initRouter(content)
mountTabbar(document.querySelector('#tabbar'))

// 폰트/에셋이 대체로 준비될 시간을 잠깐 주고 로더 숨김
window.requestAnimationFrame(() => {
  setTimeout(hideLoader, 650)
})
