# cosmicpotato2047.github.io

이찬희(Chan Lee)의 개인 사이트 — 픽셀 RPG / 어린 왕자 컨셉.
작은 행성을 여행하며 남긴 기록이 지도와 타임라인에 채워지는 3페이지 SPA.

> 사양: [`SPEC_v3.md`](./SPEC_v3.md) · 콘텐츠 갱신: [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md)

## 기술 스택

- **Vite** (vanilla JS, no framework)
- **GitHub Pages** + GitHub Actions 자동 배포 (`base: '/'`, 루트 주소 repo)
- 해시 라우터 (`#home` / `#world` / `#timeline`)
- i18n: 브라우저 언어 자동 감지 + 수동 KO/EN 토글(localStorage 저장)
- 데이터/디자인 분리: 모든 콘텐츠는 `src/data/*.json`

## 개발

```bash
npm install              # 처음 한 번
npm run dev              # 로컬 개발 서버 (http://localhost:5173)
npm run build            # 프로덕션 빌드 → dist/
npm run preview          # 빌드 결과 미리보기
npm run gen:placeholders # 임시 픽셀 에셋 재생성 (public/)
```

## 배포

`main`에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포합니다.

> ⚠ **최초 1회만 수동**: GitHub repo **Settings → Pages → Source**를
> **"GitHub Actions"** 로 바꿔야 합니다 (기존 "Deploy from a branch"에서).

## 폴더 구조

```
src/
├─ main.js              진입점: 앱 셸 + 라우터 + 탭바 마운트
├─ style.css            디자인 토큰 + 전역 스타일
├─ router.js            해시 라우팅
├─ i18n.js              언어 감지/토글 + {ko,en} 렌더 + UI 사전
├─ pages/               home · world · timeline
├─ components/          tabbar · pixelGlobe · sheet · loader
└─ data/                profile · countries · timeline  (← 여기만 고치면 됨)
public/                 픽셀 에셋(현재 플레이스홀더) + favicon + og
```

## 남은 일 (Chan)

- `public/`의 플레이스홀더를 실제 픽셀 아트로 교체 (globe / littlep / fox / rose / 아이콘 / avatar).
- `src/data/*.json`의 `REPLACE_ME` 링크를 실제 URL로 교체.
- 픽셀 폰트(Galmuri11) self-host 여부 결정 (현재 CDN).
- 자세한 내용은 `SPEC_v3.md` 9장(미정 항목) 참고.
