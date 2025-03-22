---
title: "🧱 Making This Portfolio"
layout: single
permalink: /projects/my-portfolio-making/
classes: wide
---

## 🧐 Why: 왜 만들었는가

2020년 말. 시대의 흐름에 따라 컴퓨터공학과를 선택했지만,  
시간만 흐른다고 역량이 저절로 생기지는 않는다는 사실을 깨달았다.  
"뭐라도 해야 한다"는 위기감 속에서 개발자로서 필요한 기본 소양들을 찾아보기로 했다.

> Git/GitHub, Linux, SQL, Web, JavaScript, Node.js, Docker, AWS...

4주간 주제별로 빠르게 훑어보았지만, 너무 방대했고, 이 정도로는 아무것도 할 수 없음을 깨달았다.  
그보다 더 중요한 건 ‘**일상에서 마주하는 문제를 IT 기술로 해결하는 습관**’이라는 결론에 도달했다.

---

## 💡 What: 어떤 문제를 해결하고 싶은가

해결하고 싶은 건 많았지만,  
가장 시급하면서도 당장 만들 수 있는 게 **"나의 발자취를 정리하고 보여줄 수 있는 공간"** 이었다.  
그래서 시작했다 — **포트폴리오 사이트**.

---

## 🛠 How: 어떻게 만들었는가

### 1. 어떤 플랫폼을 쓸까?

| 목적 | 추천 플랫폼 |
|------|-------------|
| 코딩 경험이 있다면 | `GitHub Pages` |
| 디자인 위주라면 | `WordPress` |
| 문서형 포트폴리오라면 | `Notion` |
| 링크 모음이라면 | `Littly` |

→ 나는 직접 코딩하는 쪽을 선택했고, 자연스럽게 **GitHub Pages + Jekyll** 조합을 선택하게 되었다.

- [Jekyll 공식 사이트](https://jekyllrb.com/)
- [GitHub 저장소](https://github.com/jekyll/jekyll)

Jekyll은 Markdown 파일을 자동으로 HTML로 변환해주고,  
Liquid 템플릿 언어를 이용해 반복적인 HTML을 줄일 수 있다.  
Ruby 기반이며 GitHub Pages와 연동도 매끄럽다.

---

### 2. 포트폴리오 구성은 어떻게?

#### 🔹 Try It  
- 내가 만든 것들을 **카테고리별 방(Room)** 으로 시각화  
- 사용자가 직접 클릭해서 체험할 수 있도록 구성  
- (예: 계산기, 타이머, 음악 플레이어 등)

#### 🔹 Portfolio  
- **좌측은 카테고리 네비게이션**, 우측은 **시간순 프로젝트 리스트**  
- 각 항목은 사진 + 한줄 설명 + How to Use + Making 글로 구성  

#### 🔹 About  
- 자기소개보다는 나의 활동(동아리, 프로젝트 등)으로 연결되는 **링크 허브**  

> 참고한 포트폴리오들:  
> [Sergio Kopplin](https://sergiokopplin.github.io/indigo/blog/) / [Brittany Chiang](https://brittanychiang.com/#projects)

---

### 3. 테마는 어떻게 선택했나?

- 처음부터 다 커스텀하면 오래 걸릴 것 같아 **Jekyll 테마를 검색**함 → [jekyllthemes.io](https://jekyllthemes.io/)
- 사용자가 많고 문서도 잘 된 **Minimal Mistakes** 선택  
- [Minimal Mistakes GitHub](https://github.com/mmistakes/minimal-mistakes)

---

### 4. 개발 시작 & 환경 세팅

#### 💻 로컬 환경에서 Jekyll 시작하기

```bash
gem install jekyll bundler
jekyll new myblog
cd myblog
bundle exec jekyll serve --livereload
```
- 브라우저에서 http://localhost:4000 접속
- Jekyll 구조 이해하기: _layouts, _includes, _data, _sass, assets, _posts, _pages 등

#### ⚙️ Minimal Mistakes 설치 & 설정

- 로컬 환경:

{% raw %}
```yaml
theme: minimal-mistakes-jekyll
plugins:
  - jekyll-feed
```
{% endraw %}

- GitHub Pages에서는:

{% raw %}
```yaml
remote_theme: "mmistakes/minimal-mistakes"
plugins:
  - jekyll-include-cache
  - jekyll-feed
```
{% endraw %}

---

### 5. 스타일 커스터마이징

처음엔 style.css를 직접 추가했는데,
기존 main.css를 덮어버리는 문제가 있어 SCSS 방식으로 커스터마이징하기로 함.

#### ✅ SCSS 구성
- _sass/style.scss → 내가 만든 스타일들
- assets/css/main.scss → 이 안에 @import로 연결
```scss
@import "minimal-mistakes"; // 기본 테마
@import "style";             // 내가 만든 스타일
```

#### ⚠️ 포인트

- main.scss에 Front Matter (---)가 반드시 필요함
- Tailwind는 지금은 사용하지 않지만, 나중에 고려해볼 수 있음

---

### 🔚 마치며

이 포트폴리오는 단순한 작품 전시가 아니라,
문제를 해결하려는 시도들을 기록하고 나누는 공간이 되었으면 한다.

앞으로 더 많은 실험과 제작이 이곳에 쌓여가길 바라며.

---
