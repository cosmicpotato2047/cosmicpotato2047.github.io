// 픽셀 지구: 제자리 흔들기(반시계 기울기) + 위아래 떠다님 (SPEC 방식 3).
// 진짜 자전 아님(PNG 한 면). 정상부에 어린 왕자 캐릭터(지구와 간격 + 바운스, 왼쪽 응시).
// 지구는 감상용 — 탭하면 국가 리스트 시트(마커 핀은 사용 안 함).

export function createPixelGlobe(onTap) {
  const el = document.createElement('div')
  el.className = 'globe'
  el.innerHTML = `
    <button class="globe__hit" type="button" aria-label="open country list">
      <span class="globe__bob">
        <img class="globe__img" src="/globe.png" alt="globe"
             onerror="this.classList.add('img--missing')" />
        <img class="globe__char" src="/littlep.png" alt=""
             onerror="this.classList.add('img--missing')" />
      </span>
    </button>
  `
  el.querySelector('.globe__hit').addEventListener('click', () => onTap && onTap())
  return el
}
