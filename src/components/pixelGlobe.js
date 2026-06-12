// 픽셀 지구: 제자리 흔들기(반시계 기울기) + 위아래 떠다님 (SPEC 방식 3).
// 진짜 자전 아님(PNG 한 면). 정상부에 어린 왕자 캐릭터(지구와 간격 + 바운스, 왼쪽 응시).
// 마커: countries status별 색/연출.
import countries from '../data/countries.json'

export function createPixelGlobe(onTap) {
  const el = document.createElement('div')
  el.className = 'globe'
  el.innerHTML = `
    <button class="globe__hit" type="button" aria-label="open country list">
      <span class="globe__bob">
        <img class="globe__img" src="/globe.png" alt="globe"
             onerror="this.classList.add('img--missing')" />
        ${renderMarkers()}
        <img class="globe__char" src="/littlep.png" alt=""
             onerror="this.classList.add('img--missing')" />
      </span>
    </button>
  `
  el.querySelector('.globe__hit').addEventListener('click', () => onTap && onTap())
  return el
}

function renderMarkers() {
  return countries
    .filter((c) => c.globe_x != null && c.globe_y != null)
    .map(
      (c) =>
        `<span class="marker marker--${c.status}" style="left:${c.globe_x}%;top:${c.globe_y}%" title="${c.name}"></span>`
    )
    .join('')
}
