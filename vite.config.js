import { defineConfig } from 'vite'

// 루트 주소 repo(cosmicpotato2047.github.io)에 배포되므로 base는 '/'.
// (프로젝트 페이지였다면 '/<repo-name>/' 가 됐을 것)
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
