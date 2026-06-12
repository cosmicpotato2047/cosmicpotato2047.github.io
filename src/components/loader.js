// 로딩 화면: 어린 왕자 캐릭터가 걷는 픽셀 애니메이션. 짧게 보여주고 사라짐.
import { ui } from '../i18n.js'

export function showLoader(parent) {
  const el = document.createElement('div')
  el.className = 'loader'
  el.innerHTML = `
    <div class="loader__stage">
      <img class="loader__char" src="/littlep.png" alt="" />
      <div class="loader__ground"></div>
    </div>
    <p class="loader__text">${ui('loading')}</p>
  `
  parent.appendChild(el)

  let removed = false
  return function hide() {
    if (removed) return
    removed = true
    el.classList.add('loader--out')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
    // transition 미지원/이미지 onerror 대비 안전망
    setTimeout(() => el.remove(), 500)
  }
}
