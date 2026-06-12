# Personal Site — Build Spec v3 (Pixel RPG / 어린 왕자)

> 이찬희(Chan Lee)의 개인 명함용 사이트. GitHub Pages 배포. 모바일 우선.
> Claude Code는 이 문서를 읽고 프로젝트를 처음부터 세팅한다. 결정은 모두 내려져 있다(8장 결정 로그). 임의로 바꾸지 말고, 애매하면 질문으로 surface하라.
> v1(수채화) → v2(픽셀 RPG) → v3에서 **i18n(한/영), 지구 흔들기 방식, 콘텐츠 갱신 가이드 추가.**

---

## 0. 컨셉 한 줄

픽셀 아트 RPG 감성의 3페이지 SPA. 어린 왕자 같은 캐릭터가 작은 행성(지구)을 여행하며 남긴 기록이 지도와 타임라인에 시간이 지나며 채워진다. "비어있음"은 약점이 아니라 콘셉트 — 아직 안 가본 행성을 향해 걷는 여행자.

세 페이지가 톤으로 리듬을 탄다: **Home(종이→우주 그라데이션) → World(픽셀 우주) → Timeline(종이)**. Home의 그라데이션 footer가 종이와 우주를 잇는 다리.

---

## 1. 기술 스택 (확정)

- **빌드**: Vite (vanilla JS, no React). `npm create vite@latest . -- --template vanilla`
- **배포**: GitHub Pages + GitHub Actions(`.github/workflows/deploy.yml`). `vite.config.js`에 `base: '/<repo-name>/'`.
- **⚠ 기존 Jekyll에서 마이그레이션**: 이 사이트는 `cosmicpotato2047.github.io` repo(루트 주소)에 기존 Jekyll + Minimal Mistakes 테마로 배포 중이었음. Vite로 교체하므로 다음을 반드시 처리:
  - `base`는 **`/`** 로 설정(루트 주소 repo이므로 `/repo-name/` 아님).
  - repo 루트에 빈 **`.nojekyll`** 파일 생성(GitHub 자동 Jekyll 빌드 비활성화).
  - 기존 Jekyll 잔재(`_config.yml`, `_posts/`, `_layouts/`, `_sass/`, `Gemfile*` 등) 제거 가정.
  - 배포 후 repo Settings > Pages > Source를 **"GitHub Actions"** 로 전환해야 함(기존 "Deploy from a branch"에서). 이건 Chan이 GitHub 웹에서 수동으로.
- **언어**: 영문 섞인 글로벌 톤(영문 UI 라벨 + 한글 본문).
- **데이터/디자인 분리(핵심 원칙)**: 모든 콘텐츠는 `src/data/*.json`. 코드를 건드리지 않고 JSON 편집만으로 갱신. 매년 초 타임라인 갱신 = JSON 한 파일 편집.
- **다국어(i18n)**: 한국어 사용자는 한글, 그 외는 영어. 기본은 브라우저 언어(`navigator.language`)로 자동 감지하되, **구석에 수동 KO/EN 토글**을 둬서 사용자가 바꿀 수 있게 한다(자동 감지가 100% 정확하지 않으므로). 선택은 localStorage에 저장. 모든 사용자 노출 텍스트는 `{ "ko": "...", "en": "..." }` 구조(profile/countries/timeline의 제목·설명 모두). UI 라벨(home/world/timeline 등)도 i18n 사전으로 관리.
- **반응형**: 모바일 우선 단일 코드베이스. 데스크탑은 `max-width: 480px` 컨테이너로 모바일 폭을 가운데 정렬(리틀리 방식). 별도 웹 버전 안 만든다(데스크탑 전용 레이아웃은 v2 보류).
- **픽셀 에셋**: Chan이 Gemini/ChatGPT/LoRA(RTX 3060)로 직접 제작. 지구(GLOBE.png), 캐릭터(LITTLEP.png), 여우·장미·별 등. 코드에선 `public/`에 두고 참조만. `image-rendering: pixelated` 필수.
- **외부 라이브러리**: 최소화. 지구 회전은 픽셀 이미지 CSS/canvas 처리로 충분(globe.gl 불필요 — 사실적 3D는 픽셀 톤과 안 맞음).

---

## 2. 폴더 구조

```
/
├─ index.html
├─ vite.config.js
├─ package.json
├─ CONTENT_GUIDE.md        # 콘텐츠 갱신 가이드 (빌드 끝에 생성, 10장)
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ avatar.jpg            # Home 실제 프로필 사진
│  ├─ globe.png            # 픽셀 지구 (회전용)
│  ├─ littlep.png          # 픽셀 어린 왕자 캐릭터
│  ├─ fox.png  rose.png    # footer 일러스트 (오리지널 픽셀)
│  ├─ icons/               # 글/사진/영상 커스텀 아이콘 (Chan 지정)
│  ├─ og.png               # 공유용 OG 이미지 (미정, 9장)
│  └─ favicon.svg
├─ src/
│  ├─ main.js              # 진입점: 라우터 + 탭바 마운트
│  ├─ style.css            # 디자인 토큰 + 전역
│  ├─ router.js            # 해시 라우팅 (#home 기본 / #world / #timeline)
│  ├─ i18n.js              # 언어 감지 + 토글 + {ko,en} 렌더 헬퍼 + UI 사전
│  ├─ pages/
│  │  ├─ home.js
│  │  ├─ world.js
│  │  └─ timeline.js
│  ├─ components/
│  │  ├─ tabbar.js         # 하단 탭바 (home/world/timeline)
│  │  ├─ pixelGlobe.js     # 픽셀 지구 회전 + 캐릭터 바운스
│  │  ├─ sheet.js          # 하단 슬라이드업 시트(국가 리스트/상세)
│  │  └─ loader.js         # 로딩 중 캐릭터 걷기 애니메이션
│  └─ data/
│     ├─ profile.json
│     ├─ countries.json
│     └─ timeline.json
```

---

## 3. 데이터 스키마 (사이트의 심장)

### 3.1 `profile.json`
```json
{
  "name_ko": "이찬희",
  "name_en": "Chan Lee",
  "tagline": { "ko": "경험 수집가", "en": "experience collector" },
  "avatar": "/avatar.jpg",
  "intro": {
    "ko": "죽기 전에 새로운 경험을 잔뜩 하고 싶어요. 오로라를 제 눈으로 직접 못 보고 죽으면 억울할 것 같거든요!",
    "en": "On a mission to experience as much of the world as possible. No way I'm dying before seeing the Northern Lights with my own eyes."
  },
  "links": [
    { "type": "writing", "icon": "/icons/writing.png", "url": "https://litt.ly/..." },
    { "type": "photo",   "icon": "/icons/photo.png",   "url": "https://instagram.com/..." },
    { "type": "video",   "icon": "/icons/video.png",   "url": "https://youtube.com/@..." }
  ]
}
```
> tagline 확정: 경험 수집가 / experience collector. intro 확정(위). 영문 intro 끝 이모지(✨🌌) 추가 여부는 9장 참고. 링크 아이콘은 Chan 지정 커스텀 이미지. 텍스트 라벨(text/image/video)은 **넣지 않는다**(아이콘만). 이름·tagline·intro·링크 모두 하드코딩 금지.

### 3.2 `countries.json`
```json
[
  {
    "id": "us", "name": "United States", "name_ko": "미국",
    "lat": 38, "lng": -97,
    "globe_x": 42, "globe_y": 30,
    "status": "visited", "period": "2025",
    "projects": [
      { "type": "ebook",
        "title": { "ko": "미국에서 쓴 첫 기록", "en": "My first travel ebook, written in the US" },
        "url": "https://litt.ly/..." }
    ]
  },
  {
    "id": "jp", "name": "Japan", "name_ko": "일본",
    "lat": 36, "lng": 138, "globe_x": 96, "globe_y": 64,
    "status": "upcoming", "period": "2026.06 – 2026.08", "projects": []
  },
  {
    "id": "fr", "name": "France", "name_ko": "프랑스",
    "lat": 46, "lng": 2, "status": "planned", "period": "2027~", "projects": []
  }
]
```
- `status`: `"visited"` | `"upcoming"` | `"planned"` — 색/연출 분기.
  - visited → terracotta `#c2724a`, 빛남
  - upcoming → amber `#d99a3a`, 펄스 애니메이션
  - planned → sage `#8a9b7a`, 점선 pill
- `name`은 영문 표시명, `name_ko`는 한글 표시명(언어에 따라 선택). `projects[].title`은 `{ko,en}`.
- `projects[].type`: `"ebook"` | `"youtube"` | `"instagram"` | `"other"` → 아이콘 매핑.
- `globe_x/globe_y`: 픽셀 지구 위 마커 좌표(선택, 핀 표시용).
- 새 나라 추가 = 배열에 객체 push. 끝. (자세한 절차는 `CONTENT_GUIDE.md`)

### 3.3 `timeline.json`
```json
[
  {
    "year": 2026, "open_by_default": true,
    "entries": [
      { "title": { "ko": "일본 2개월 종단 여행", "en": "2-month journey across Japan" },
        "desc":  { "ko": "46개 지역, 유튜브 + 전자책", "en": "46 regions, YouTube + ebook" },
        "tags": ["travel","youtube"], "url": null },
      { "title": { "ko": "개인 사이트 오픈", "en": "Launched this site" },
        "desc":  { "ko": "바로 이 사이트", "en": "the one you're on" },
        "tags": ["build"], "url": null }
    ]
  },
  {
    "year": 2025, "open_by_default": false,
    "entries": [
      { "title": { "ko": "미국 여행 + 전자책 출간", "en": "US trip + ebook" },
        "desc":  { "ko": "첫 해외 기록을 책으로", "en": "My first overseas record, as a book" },
        "tags": ["travel","ebook"], "url": "https://litt.ly/..." }
    ]
  }
]
```
- 연도 내림차순 렌더(최신 위). `open_by_default: true`인 연도만 펼친 채 시작(현재 2026만).
- `title`/`desc`는 `{ko,en}`. (갱신 절차는 `CONTENT_GUIDE.md`)

---

## 4. 전역 레이아웃 & 네비게이션

- **앱 셸**: 콘텐츠 영역(스크롤) + **하단 고정 탭바**.
- **하단 탭바**(`tabbar.js`): 3탭 — `home` / `world` / `timeline`. 라벨은 소문자 한 단어. 활성 탭은 톤 컬러 강조, 비활성은 흐림. 아이콘은 inline SVG 또는 Tabler. 터치 타겟 ≥44px.
  - 탭바 배경은 현재 페이지 톤에 맞춤: 종이 페이지(Home/Timeline)에선 밝게, World에선 어둡게(반투명 + blur).
- **라우팅**: 해시 기반(`#home` 기본). GitHub Pages는 서버 라우팅 없음 → 해시 라우터 필수.
- **첫 진입**: 타이틀 화면 없이 **바로 Home**. ("Press Start" 화면 안 만듦.)
- **데스크탑**: 전체를 `max-width:480px` 컨테이너로 가운데 정렬. 양옆 배경은 은은한 별 또는 종이결.
- **언어 토글**: 화면 구석(예: 우상단)에 작은 KO/EN 토글. 첫 방문 시 `navigator.language`로 기본값 결정, 이후 선택을 localStorage에 저장. 전환 시 모든 i18n 텍스트 즉시 교체.

---

## 5. 디자인 토큰

```css
:root {
  /* paper / warm (Home 상단, Timeline) */
  --paper:        #fbfaf7;
  --paper-2:      #f4ede1;
  --ink:          #2c2a26;
  --ink-soft:     #6b5d45;
  --ink-faint:    #a8967a;

  /* status (지도/타임라인 공통) */
  --visited:      #c2724a;   /* terracotta */
  --upcoming:     #d99a3a;   /* amber */
  --planned:      #8a9b7a;   /* sage */

  /* space (World, Home footer) */
  --space:        #070a1a;
  --space-2:      #0e1430;
  --space-line:   #2a3a5a;
  --star:         #ffffff;
  --accent-soft:  #c9b8f5;   /* hint 문구 등 */

  --radius:       14px;
  --font-pixel:   "Galmuri11", "DungGeunMo", monospace;  /* 픽셀/레트로 (제목·UI 라벨) */
  --font-body:    "Pretendard", system-ui, sans-serif;   /* 본문 가독성 */
}
```
- **폰트**: 제목·UI 라벨은 픽셀 폰트(Galmuri11 등 한글 지원 픽셀 폰트), 본문은 Pretendard로 가독성 확보(픽셀 폰트로 긴 글 읽기는 피로). 픽셀 폰트는 라이선스 확인 후 self-host.
- **픽셀 렌더링**: 모든 픽셀 이미지/캔버스에 `image-rendering: pixelated`.
- 과한 그라데이션·그림자 금지(단, Home의 종이→우주 세로 그라데이션은 의도된 핵심 요소 — 예외).

---

## 6. 페이지별 동작 명세

### 6.1 Home (`#home`) — 종이→우주 그라데이션 명함
세로 중앙 정렬, 좁은 카드(리틀리 스타일). 위에서 아래로:
1. **원형 프로필 사진**(실제 사진, `avatar`). 테두리 톤 컬러.
2. **이름**: "이찬희" + 그 아래 작게 "Chan Lee".
3. **tagline**: 한 줄(9장에서 확정). wanderer는 쓰지 않음.
4. **링크 3개**: 글/사진/영상. **커스텀 아이콘만**(텍스트 라벨 없음). 가로 한 줄, 탭 시 `target="_blank"` 외부 링크.
5. **소개 문구**(`intro`): 가운데, 줄간 넉넉히.
6. **그라데이션 footer (핵심 연출)**: 배경이 위는 흰색(`--paper`) → 아래로 갈수록 우주 별빛 검정(`--space`)으로 세로 그라데이션. 중간~하단에 별이 점점 많아짐. 맨 아래 작은 반구(어린 왕자의 행성) 위에 **여우와 장미**(오리지널 픽셀)가 앉아 있음. 시선을 자연스럽게 아래로 유도 → world 탭으로 이동 욕구 유발.
- 전부 `profile.json`에서 렌더.
- ※ 어린 왕자 캐릭터(littlep)는 Home엔 등장 안 함(World/로딩에서만). footer엔 여우·장미.

### 6.2 World (`#world`) — 픽셀 우주 (핵심 페이지)
**확정: 지구 감상용 + 탭하면 국가 리스트 시트. 직접 마커 클릭 아님.**
- 배경: 별이 박힌 우주(`--space`). 별은 CSS/canvas 정적 + 미세 트윙클(성능 우선).
- 상단: "WORLD MAP" 제목(픽셀 폰트) + 작은 부제("the journey so far").
- 중앙: **픽셀 지구**(globe.png).
  - **살짝 흔들기 + 떠다님(방식 3 확정)**: 제자리에서 미세하게 좌우로 흔들리고(반시계 쪽 기울기 기준) 위아래로 천천히 떠다님. *진짜 자전 아님* — 현재 지구 PNG가 한 면짜리라 가로 스크롤/통회전은 대륙이 끊기거나 뒤집혀서 불가. (진짜 자전을 원하면 가로로 이어지는 seamless 파노라마 텍스처를 따로 제작해야 함 — 9장 참고.) 줌 비활성.
  - 지구 위 **어린 왕자 캐릭터(littlep)**: 작게, 지구 정상부 위에 배치하되 **지구와 살짝 간격을 둠**(발이 묻히지 않게, "공 위에 가볍게 선" 느낌) + 위아래 바운스. 캐릭터는 왼쪽을 바라봄 → 진행 방향감과 흔들기 방향(반시계)을 맞춤. 방식 A(곡면 궤도 이동 아님).
  - 마커: countries status별 색/연출(visited 빛남 / upcoming 펄스 / planned 흐림).
  - "click the globe" 안내 문구(픽셀 폰트, 살짝 떠다니거나 깜빡임, i18n). 시트 열리면 숨김.
- **인터랙션**:
  - 지구 탭 → **하단에서 국가 리스트 시트 슬라이드업**(`sheet.js`). 드래그 핸들 + status별 섹션(VISITED / UPCOMING / PLANNED).
  - visited/upcoming은 카드(이름+기간+요약), planned는 점선 pill 묶음.
  - 국가 항목 탭 → 시트가 상세로 전환: 국가명 + 기간 + `projects` 리스트(type 아이콘 + 제목 + 외부 링크). projects 비면 "곧 채워질 이야기" placeholder.
  - 시트 다시 탭/스와이프 다운 → 닫힘, 지구 화면 복귀.

### 6.3 Timeline (`#timeline`) — 종이 일지
- 배경: 종이결(`--paper`).
- 상단: "TIMELINE" 제목 + 부제("a record of the journey").
- 세로 타임라인, 연도 내림차순(최신 위). 왼쪽 세로선 + 연도별 점(dot): 최신 terracotta, 과거 베이지.
- 각 연도 = **아코디언 토글**. 헤더(연도) 탭 → 펼침/접힘, chevron 회전.
- **초기 상태**: `open_by_default: true` 연도만 펼침(현재 2026). 나머지 접힘.
- 펼친 연도: entry 카드 리스트(제목 + 설명 + 태그 pill + url 있으면 외부 링크 아이콘).
- 전부 `timeline.json`에서 렌더.

### 6.4 로딩 화면 (전역)
- 페이지/에셋 로딩 중 **어린 왕자 캐릭터가 걷는 픽셀 애니메이션**(`loader.js`). 짧게, 첫 진입이나 World 에셋 로드 시.

---

## 7. 구현 순서

1. 기존 Jekyll repo를 정리(잔재 삭제, `.git` 보존)하고 Vite vanilla 생성 + `.nojekyll` 추가 + GitHub Actions 배포(`deploy.yml`). `base: '/'`. 실제 루트 주소(`cosmicpotato2047.github.io`)에 "Hello"가 뜨는 것부터 확인(배포 막히면 나중에 고생). ※ Settings > Pages Source를 "GitHub Actions"로 바꾸는 건 Chan이 수동.
2. 앱 셸 + 하단 탭바 + 해시 라우터. 3개 빈 페이지 전환.
3. 디자인 토큰(`style.css`) + 픽셀/본문 폰트 로드.
4. `data/*.json` 3개 placeholder 생성.
5. **Home** 구현(그라데이션 footer 포함). 실제 링크/사진은 Chan이 채울 자리로 비움.
6. **Timeline** 구현(아코디언).
7. **World** 구현(픽셀 지구 회전 + 캐릭터 바운스 + 시트). 가장 무거움 → 마지막.
8. 로딩 애니메이션(`loader.js`).
9. **i18n 시스템**: 언어 감지 + 토글 + `{ko,en}` 렌더 헬퍼. 모든 페이지에 적용.
10. **`CONTENT_GUIDE.md` 생성**(아래 10장 지시대로 — 실제 최종 데이터 구조에 맞춰 작성).
11. 모바일 실기기 확인(반응형, 탭존, 터치 타겟 ≥44px, 픽셀 렌더링, 언어 전환).

---

## 8. 결정 로그 (바꾸지 말 것 / 바꾸려면 Chan 확인)

- [확정] 개발 도구: Claude Code.
- [확정] 톤: **픽셀 RPG + 어린 왕자**(수채화 폐기). 실제 에셋 GLOBE.png / LITTLEP.png 사용.
- [확정] 모바일 우선, 데스크탑 전용 레이아웃 v2 보류.
- [확정] 탭바: 화면 하단 고정. 라벨 home/world/timeline.
- [확정] 탭 라벨은 "world"(world map 아님). 페이지 내 제목만 "WORLD MAP".
- [확정] 첫 진입: 바로 Home(타이틀 화면 없음).
- [확정] Home: 미니멀 + 종이→우주 그라데이션 footer(여우·장미 픽셀). 캐릭터는 Home에 없음.
- [확정] 링크 3개: 커스텀 아이콘만, 텍스트 라벨(text/image/video) 없음.
- [확정] 이름: 이찬희 / Chan Lee. tagline "경험 수집가 / experience collector"(wanderer 제거).
- [확정] 소개 문구 한·영 확정(3.1). 영문 이모지 여부만 미정.
- [확정] 다국어: 브라우저 언어 자동 + 수동 KO/EN 토글, localStorage 저장, 모든 콘텐츠 `{ko,en}`.
- [확정] World: 지구 감상용 + 탭하면 국가 리스트 시트. 지구는 **방식 3(흔들기+떠다님)**, 진짜 자전 아님(PNG 한 면). 캐릭터는 지구와 살짝 간격 + 바운스, 왼쪽 응시. "click the globe" 문구.
- [확정] 캐릭터 등장: World + 로딩 화면에서만.
- [확정] Timeline: 최신 연도만 펼친 채 시작.
- [확정] 실제 사진 사용, 데이터/디자인 분리(전부 JSON).
- [확정] `CONTENT_GUIDE.md`를 빌드 끝에 생성(갱신 절차 문서화).

## 9. 미정 / Chan 확인 필요

- [ ] 영문 intro 끝 이모지(✨🌌) 유지할지 — 픽셀/미니멀 톤이면 빼고 픽셀 별 일러스트로 분위기, 캐주얼 친근감 원하면 유지.
- [ ] 실제 링크 URL(리틀리/인스타/유튜브).
- [ ] 커스텀 링크 아이콘 3종 이미지.
- [ ] 픽셀 에셋: globe / littlep / fox / rose / 마커. (여우·장미는 어린 왕자 원작 삽화 베끼지 말 것 — 저작권 2045년까지. 오리지널 픽셀로.)
- [ ] (선택) 진짜 자전 원하면 가로 seamless 파노라마 지구 텍스처 별도 제작. 안 하면 방식 3 유지.
- [ ] 픽셀 폰트 선택 + 라이선스 확인(Galmuri11 등, 한글 지원).
- [ ] GitHub repo 이름(→ vite base 경로) / 커스텀 도메인 여부.
- [ ] OG 이미지(공유 썸네일) 디자인 — 픽셀 지구+캐릭터 권장.
- [ ] 연락 수단 추가 여부(이메일 등) — 현재는 링크 3개로 충분하다고 가정.
- [ ] BGM(레트로 칩튠) 토글 / 효과음 — 넣을지 보류.

---

## 10. `CONTENT_GUIDE.md` 작성 지시 (빌드 끝에 Claude Code가 생성)

> 목적: Chan이 1년 뒤에도 코드를 모른 채 콘텐츠만 갱신할 수 있게. 실제 최종 데이터 구조·파일 경로에 맞춰 작성할 것. 한국어로.

포함할 내용:
1. **새 나라 추가하기** — `src/data/countries.json`을 열고, 복붙용 템플릿 객체(모든 필드 채워진 예시)를 제공. 각 필드 설명: `status`에 들어갈 수 있는 값 3종과 각각의 시각 효과, `projects[].type` 종류와 아이콘 매핑, `{ko,en}` 양쪽 다 채워야 함, lat/lng 찾는 법(간단 안내).
2. **새 연도/프로젝트 추가하기** — `src/data/timeline.json` 템플릿. 연도는 내림차순, `open_by_default`는 보통 새 최신 연도만 true로 바꾸고 이전 것은 false로. entry 템플릿과 tags 예시.
3. **프로필 수정하기** — `profile.json`에서 사진·링크·intro 바꾸는 법. 이미지 교체는 `public/`에 같은 이름으로 덮어쓰기.
4. **이미지/픽셀 에셋 넣는 법** — `public/` 경로 규칙, 권장 크기, `image-rendering: pixelated` 자동 적용됨을 안내.
5. **변경사항 배포하기** — JSON 저장 → `git add . && git commit && git push` → GitHub Actions가 자동 배포 → 몇 분 뒤 반영. (Claude Code 쓰면 "이 내용 추가해줘"로도 가능함을 한 줄 안내.)
6. **자주 하는 실수** — JSON 문법(쉼표·따옴표), `{ko,en}` 한쪽 빠뜨림, 이미지 경로 오타. 검증: 저장 후 로컬에서 `npm run dev`로 확인.

