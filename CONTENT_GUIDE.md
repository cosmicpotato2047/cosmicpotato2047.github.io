# 콘텐츠 갱신 가이드

> 코드를 몰라도 이 사이트의 내용을 직접 바꿀 수 있게 만든 안내서입니다.
> 거의 모든 내용은 `src/data/` 폴더 안 **JSON 파일 3개**만 고치면 됩니다.
> 디자인/코드는 건드리지 않아도 됩니다.

핵심 규칙 딱 두 개만 기억하세요:

1. **모든 글은 한국어(`ko`)와 영어(`en`) 양쪽을 다 채웁니다.** 한쪽만 쓰면 그 언어에서 빈칸으로 보입니다.
2. **JSON 문법**: 항목 사이엔 쉼표 `,`, 글자는 큰따옴표 `"..."`. 마지막 항목 뒤엔 쉼표를 붙이지 않습니다.

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
  "lat": 42,
  "lng": 12,
  "globe_x": 58,
  "globe_y": 30,
  "status": "planned",
  "period": "2028~",
  "projects": [
    {
      "type": "youtube",
      "title": { "ko": "로마에서 찍은 영상", "en": "Filmed in Rome" },
      "url": "https://youtube.com/..."
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
| `lat`, `lng` | 위도·경도(숫자) | 아래 "좌표 찾는 법" 참고 |
| `globe_x`, `globe_y` | (현재 미사용) 지구 위 마커 좌표 | 지구에 핀을 안 찍기로 해서 지금은 안 쓰임. 그냥 둬도 무방 |
| `status` | 상태 3종 중 하나 | 아래 표 참고 |
| `period` | 기간 글자 | 예: `"2025"`, `"2026.06 – 2026.08"`, `"2027~"` |
| `projects` | 그 나라에서 한 작업들(없으면 `[]`) | 비우면 "곧 채워질 이야기"가 자동 표시 |

**`status` 값과 화면 효과:**

| 값 | 의미 | 색/연출 |
|----|----|----|
| `"visited"` | 다녀옴 | terracotta(주황빛), 마커가 빛남 |
| `"upcoming"` | 곧 떠남 | amber(노란빛), 마커가 깜빡임(펄스) |
| `"planned"` | 계획 중 | sage(연두빛), 점선 pill |

**`projects[].type` 값과 아이콘:**

| 값 | 아이콘 |
|----|----|
| `"ebook"` | 글 아이콘 |
| `"youtube"` | 영상 아이콘 |
| `"instagram"` | 사진 아이콘 |
| `"other"` | 글 아이콘(기본) |

**위도·경도(lat/lng) 찾는 법:** 구글에 "(나라이름) latitude longitude" 검색 →
나오는 숫자 두 개를 넣으면 됩니다. 정확하지 않아도 됩니다(현재는 표시에 큰 영향 없음).
`globe_x`/`globe_y`는 지구 그림 위 점 위치라서, 한 번 넣고 화면 보면서 숫자를 조금씩 조정하세요.

---

## 2. 새 연도 / 프로젝트 추가하기 — `src/data/timeline.json`

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
- `open_by_default`: 화면 처음 열 때 펼쳐둘지(`true`)/접어둘지(`false`).
  보통 **가장 최신 연도만 `true`**, 나머지는 `false`로 바꿔주세요.
- `entries`: 그 해의 일들. 객체를 늘리면 카드가 늘어납니다.
- `tags`: 작은 라벨들. 예: `["travel"]`, `["build"]`, `["travel", "ebook"]`.
- `url`: 누르면 열릴 외부 링크. 없으면 `null`(따옴표 없이).

---

## 3. 프로필 수정하기 — `src/data/profile.json`

Home(첫 화면) 명함입니다.

```json
{
  "name_ko": "이찬희",
  "name_en": "Chan Lee",
  "tagline": { "ko": "경험 수집가", "en": "experience collector" },
  "avatar": "/avatar.png",
  "intro": { "ko": "한국어 소개…", "en": "english intro…" },
  "links": [
    { "type": "writing", "icon": "/icons/writing.png", "url": "https://..." },
    { "type": "photo",   "icon": "/icons/photo.png",   "url": "https://..." },
    { "type": "video",   "icon": "/icons/video.png",   "url": "https://..." }
  ]
}
```

- **링크 URL 바꾸기**: `links` 안 각 항목의 `"url"`만 실제 주소로 교체.
  지금은 `REPLACE_ME`가 들어 있으니 꼭 바꿔주세요(글=litt.ly, 사진=instagram, 영상=youtube).
- **사진 바꾸기**: `public/` 폴더에 **같은 이름(`avatar.png`)으로 덮어쓰기**. JSON은 그대로 둬도 됩니다.
- **소개·tagline 바꾸기**: `intro`/`tagline`의 `ko`·`en` 글자만 수정.

---

## 4. 이미지 / 픽셀 에셋 넣는 법 — `public/` 폴더

화면에 쓰이는 그림은 전부 `public/` 안에 있습니다. **JSON의 경로는 `public`을 뺀 `/파일명` 형식**입니다
(예: 파일 `public/globe.png` → 코드에선 `/globe.png`).

| 파일 | 쓰이는 곳 | 권장 크기(픽셀아트) |
|------|----------|------|
| `avatar.png` | Home 프로필 사진 | 200×200 정도 |
| `globe.png` | World 픽셀 지구 | 64×64 ~ 128×128 |
| `littlep.png` | 캐릭터(World/로딩) | 24×32 정도 |
| `fox.png`, `rose.png` | Home footer 일러스트 | 24×24 정도 |
| `asteroid.png` | Home footer 행성(여우·장미가 앉는) | 256×256, 투명 배경 |
| `icons/gitbook.svg` · `instagram.svg` · `youtube.svg` | 링크/프로젝트 아이콘 | SVG(벡터) |
| `og.png` | 공유 썸네일 | 1200×630 |
| `favicon.svg` | 브라우저 탭 아이콘 | — |

- **교체 방법**: 같은 이름으로 덮어쓰면 끝. (이름을 바꾸면 JSON/코드의 경로도 같이 바꿔야 합니다.)
- 픽셀 그림은 **`image-rendering: pixelated`가 자동 적용**되어 또렷하게(흐림 없이) 나옵니다.
- 현재 들어 있는 그림들은 **임시 플레이스홀더**입니다. 실제 픽셀 아트로 덮어쓰면 바로 반영됩니다.
  (플레이스홀더를 다시 만들고 싶으면 `npm run gen:placeholders`)

---

## 5. 변경사항 배포하기

JSON이나 이미지를 바꿨다면, 터미널에서 폴더 안에서:

```bash
git add .
git commit -m "콘텐츠 업데이트"
git push
```

`push` 하면 GitHub Actions가 **자동으로 빌드·배포**합니다. 몇 분 뒤 실제 사이트에 반영됩니다.
(배포 진행 상황은 GitHub repo의 **Actions** 탭에서 볼 수 있어요.)

> 💡 Claude Code를 쓰고 있다면 "이 나라/연도 추가해줘"라고 말로 시켜도 됩니다.

---

## 6. 자주 하는 실수

- **쉼표 빠짐 / 따옴표 빠짐**: JSON에서 제일 흔한 오류. 항목 사이 `,`, 글자는 `"..."`.
- **마지막 항목 뒤 쉼표**: 배열·객체의 **마지막** 요소 뒤엔 쉼표를 붙이면 안 됩니다.
- **`{ko,en}` 한쪽만 채움**: 빠진 언어에서 빈칸으로 보입니다. 둘 다 채우세요.
- **이미지 경로 오타**: `public/icons/photo.png` → 코드에선 `/icons/photo.png`.
- **확인하는 법**: 저장 후 폴더에서 `npm run dev` 실행 → 브라우저에서 `http://localhost:5173` 열어
  바뀐 내용·언어 전환을 눈으로 확인하고 나서 배포하세요.
  (`npm install`을 아직 안 했다면 처음 한 번만 실행)
