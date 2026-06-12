# 콘텐츠 갱신 가이드

> 코드를 몰라도 이 사이트의 내용을 직접 바꿀 수 있게 만든 안내서입니다.
> 거의 모든 내용은 `src/data/` 폴더 안 **JSON 파일 3개**만 고치면 됩니다.
> 디자인/코드는 건드리지 않아도 됩니다.

핵심 규칙 딱 두 개만 기억하세요:

1. **사용자에게 보이는 글은 한국어(`ko`)와 영어(`en`) 양쪽을 다 채웁니다.** 한쪽만 쓰면 그 언어에서 빈칸으로 보입니다.
   - `{ "ko": "한국어", "en": "english" }` 형태로 되어 있는 칸이 그렇습니다.
2. **JSON 문법**: 항목 사이엔 쉼표 `,`, 글자는 큰따옴표 `"..."`. **마지막** 항목 뒤엔 쉼표를 붙이지 않습니다.

---

## 1. 새 나라 추가하기 — `src/data/countries.json`

World(지구) 화면의 국가 목록입니다. 파일을 열면 `[ ... ]` 안에 나라 객체 `{ ... }`들이 줄지어 있습니다.
**새 나라 = 객체 하나를 복사해 맨 끝에 붙여넣고 내용만 바꾸기.**

복붙용 템플릿(모든 칸이 채워진 예시):

```json
{
  "id": "it",
  "name": "Italy",
  "name_ko": "이탈리아",
  "emoji": "🇮🇹",
  "lat": 42,
  "lng": 12,
  "status": "visited",
  "period": { "ko": "2028 봄", "en": "Spring 2028" },
  "projects": [
    {
      "type": "ebook",
      "title": { "ko": "로마 여행기", "en": "A Rome travelogue" },
      "url": "https://litt.ly/..."
    }
  ]
}
```

각 칸 설명:

| 칸 | 뜻 | 주의 |
|----|----|----|
| `id` | 내부 구분용 짧은 영문(겹치면 안 됨) | 예: `it`, `de`, `nz` |
| `name` | 영어 표시 이름 | EN일 때 보임 |
| `name_ko` | 한글 표시 이름 | KO일 때 보임 |
| `emoji` | 이름 앞에 붙는 국기/이모지 | 없으면 칸째로 빼면 됨. 아래 참고 |
| `lat`, `lng` | 위도·경도(숫자) | 아래 "좌표 찾는 법" 참고 |
| `status` | 상태 3종 중 하나 | 아래 표 참고 |
| `period` | 기간 | 날짜만이면 `"2026.02"`처럼 문자열, **단어가 들어가면 꼭 `{ko,en}`** |
| `projects` | 그 나라에서 한 작업들(없으면 `[]`) | 비우면 "곧 채워질 이야기"가 자동 표시 |

**`status` 값과 화면 효과:**

| 값 | 의미 | 표시 |
|----|----|----|
| `"visited"` | 다녀옴 | terracotta(주황) 카드 — 이름·기간·요약 |
| `"upcoming"` | 곧 떠남 | amber(노랑) 카드 |
| `"planned"` | 계획 중 | sage(연두) **점선 pill** |

- visited/upcoming 카드는 누르면 **상세**(기간 + projects)가 열립니다. (카드 오른쪽 `›` 표시가 "눌러서 상세 보기" 신호)

**`emoji`(국기/이모지) 넣는 법:**
- Windows에서 `윈도우키 + .` → 이모지 선택창. 국기는 "flags"에서.
- ⚠️ **국기 이모지는 Windows 화면에선 `US`·`JP` 같은 글자로 보일 수 있습니다**(윈도우 한계). 하지만 **아이폰·안드로이드·맥에선 진짜 국기**로 보입니다. 이 사이트는 모바일 우선이라 방문자 대부분은 국기로 봅니다.
- 대륙처럼 국기가 없는 곳은 globe 이모지 사용: 🌍(유럽·아프리카) 🌎(아메리카) 🌏(아시아·오세아니아).

**`projects[].type` 값과 아이콘:**

| 값 | 아이콘 |
|----|----|
| `"ebook"` | 책 (book-open) |
| `"youtube"` | 유튜브 |
| `"instagram"` | 인스타그램 |
| `"other"` | 책 (기본) |

**위도·경도(lat/lng) 찾는 법:** 구글에 "(나라이름) latitude longitude" 검색 →
나오는 숫자 두 개를 넣으면 됩니다. (현재는 표시에 큰 영향 없어 대략이어도 OK.)

---

## 2. 새 연도 / 항목 추가하기 — `src/data/timeline.json`

Timeline(일지) 화면입니다. `[ ... ]` 안에 **연도 묶음**이 들어 있습니다.

새 연도 템플릿:

```json
{
  "year": 2027,
  "open_by_default": true,
  "entries": [
    {
      "title": { "ko": "유럽 한 달 여행", "en": "A month across Europe" },
      "desc":  { "ko": "기차로 7개국", "en": "7 countries by train" },
      "tags": ["travel", "youtube"],
      "url": "https://..."
    }
  ]
}
```

규칙:

- **연도는 내림차순**(최신이 위). 새 연도는 보통 배열 맨 앞에 넣습니다.
- `open_by_default`: 처음에 펼쳐둘지(`true`)/접을지(`false`). **여러 해를 펼쳐도 됩니다**(지금은 2026·2025 둘 다 `true`).
  - 매년 초 갱신 팁: 새 최신 연도를 `true`로 하고, 오래된 해는 `false`로 바꿔주면 깔끔합니다.
- `entries`: 그 해의 일들. 객체를 늘리면 카드가 늘어납니다.
- `title` / `desc`: 둘 다 `{ko,en}`.
- `tags`: 작은 라벨들. 예: `["travel"]`, `["study"]`, `["volunteer", "award"]`.
- `url`: 누르면 열릴 외부 링크(카드에 ↗ 표시됨). 없으면 `null`(따옴표 없이).

**한 카드 안에 여러 줄(불릿) 넣기:** `desc` 안에서 `\n`(역슬래시+n)으로 줄을 나누고, 각 줄을 `• `로 시작하면 목록처럼 보입니다.

```json
"desc": {
  "ko": "• 2025.11.06 NHN 기업 탐방 (주관 OPENUP)\n• 2025.11.10 금융결제원 탐방 (주관 서울과학기술대학교)",
  "en": "• Nov 6 — NHN (hosted by OPENUP)\n• Nov 10 — KFTC (hosted by SeoulTech)"
}
```

**불릿 형식 규칙(통일):** `• 날짜 [항목] (부가정보)`
- 부가정보(장소·주관·협력기관)는 **전부 괄호 안에 콤마로** — 괄호 밖에 `with` 등이 튀어나오지 않게.
- 주관처는 `주관 OO`, 협력은 `OO 협력`. 단일 날짜는 맨 앞.
- 기간 범위가 있는 항목만 예외로 끝에 `(2025.4.17–5.27)` 형태로.

---

## 3. 프로필 수정하기 — `src/data/profile.json`

Home(첫 화면) 명함입니다.

```json
{
  "name_ko": "이찬희",
  "name_en": "Chan Lee",
  "tagline": { "ko": "경험 수집가", "en": "experience collector" },
  "avatar": "/avatar.jpg",
  "intro": { "ko": "한국어 소개…", "en": "english intro…" },
  "links": [
    { "type": "writing", "icon": "/icons/book-open.svg", "url": "https://litt.ly/..." },
    { "type": "photo",   "icon": "/icons/instagram.svg", "url": "https://instagram.com/..." }
  ]
}
```

- **이름**: KO일 땐 `name_ko`가 크게/`name_en`이 작게, EN일 땐 반대로 표시됩니다.
- **소개·tagline**: `intro`/`tagline`의 `ko`·`en` 글자만 수정. 사진은 원형으로 자동 크롭됩니다.
- **intro 줄바꿈**: `\n`을 넣으면 그 자리에서 줄이 바뀝니다(빈 줄 원하면 `\n\n`).
- **링크 추가/삭제**: `links` 배열에 객체를 넣고 빼면 됩니다.
  - 예) 유튜브 채널이 생기면 아래 객체를 추가:
    `{ "type": "video", "icon": "/icons/youtube.svg", "url": "https://youtube.com/@..." }`
  - `icon`은 `public/icons/` 안의 파일 경로, `url`은 실제 주소.
- **사진 교체**: `public/`에 **같은 이름(`avatar.jpg`)으로 덮어쓰기**. JSON은 그대로 둬도 됩니다.

---

## 4. 이미지 / 픽셀 에셋 넣는 법 — `public/` 폴더

화면에 쓰이는 그림은 전부 `public/` 안에 있습니다. **JSON의 경로는 `public`을 뺀 `/파일명` 형식**입니다
(예: 파일 `public/globe.png` → 코드에선 `/globe.png`).

| 파일 | 쓰이는 곳 | 권장 |
|------|----------|------|
| `avatar.jpg` | Home 프로필 사진 | 정사각형(원형 크롭됨) |
| `globe.png` | World 픽셀 지구 | 픽셀아트 |
| `littlep.png` | 캐릭터(World/로딩) | 픽셀아트 |
| `fox.png`, `rose.png` | Home footer (행성 위) | 작은 픽셀아트 |
| `asteroid.png` | Home footer 행성 | 256×256, **투명 배경** |
| `icons/book-open.svg` · `instagram.svg` · `youtube.svg` | 링크/프로젝트 아이콘 | SVG(벡터) |
| `og.png` | 공유 썸네일 | 1200×630 |
| `favicon.svg` | 브라우저 탭 아이콘 | — |

- **파일 이름은 소문자로.** ⚠️ 배포 서버(리눅스)는 대소문자를 구분합니다. `GLOBE.png`처럼 대문자로 올리면 로컬(윈도우)에선 되는데 **배포 후엔 이미지가 안 보일 수 있어요.** 항상 소문자(`globe.png`)로.
- **교체 방법**: 같은 이름으로 덮어쓰면 끝. (이름을 바꾸면 JSON/코드의 경로도 같이 바꿔야 합니다.)
- 픽셀 그림(png)은 `image-rendering: pixelated`가 자동 적용되어 또렷하게 나옵니다.

---

## 5. 변경사항 배포하기

JSON이나 이미지를 바꿨다면, 터미널에서 폴더 안에서:

```bash
git add .
git commit -m "콘텐츠 업데이트"
git push
```

`push` 하면 GitHub Actions가 **자동으로 빌드·배포**합니다. 몇 분 뒤 실제 사이트에 반영됩니다.
(배포 진행 상황은 GitHub repo의 **Actions** 탭에서 볼 수 있어요. 반영 후 브라우저는 `Ctrl+F5`로 강력 새로고침.)

> 💡 Claude Code를 쓰고 있다면 "이 나라/연도 추가해줘"라고 말로 시켜도 됩니다.

---

## 6. 자주 하는 실수

- **쉼표 빠짐 / 따옴표 빠짐**: JSON에서 제일 흔한 오류. 항목 사이 `,`, 글자는 `"..."`.
- **마지막 항목 뒤 쉼표**: 배열·객체의 **마지막** 요소 뒤엔 쉼표를 붙이면 안 됩니다.
- **`{ko,en}` 한쪽만 채움**: 빠진 언어에서 빈칸으로 보입니다. 둘 다 채우세요. (`period`에 단어가 들어갈 때도!)
- **이미지 경로 오타 / 대문자**: `public/icons/youtube.svg` → 코드에선 `/icons/youtube.svg`. 소문자로.
- **확인하는 법**: 저장 후 폴더에서 `npm run dev` 실행 → 브라우저에서 `http://localhost:5173` 열어
  바뀐 내용·언어 전환(KO/EN)을 눈으로 확인하고 나서 배포하세요.
  (`npm install`을 아직 안 했다면 처음 한 번만 실행)
