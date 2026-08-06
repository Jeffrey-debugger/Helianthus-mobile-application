# Helianthus-mobile-application

Solar Mobility VPP/EMS 대시보드를 실행할 수 있는 React + Vite 프로젝트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 빌드

```bash
npm run build
```

## 웹으로 배포해서 보기 (GitHub Pages)

이미 `.github/workflows/deploy-pages.yml` 파일이 추가되어 있어, `work` 브랜치에 푸시하면 Pages 배포가 자동으로 실행됩니다.

1. GitHub 저장소 **Settings → Pages**로 이동
2. **Source**를 **GitHub Actions**로 선택
3. 이 브랜치를 원격에 푸시
4. 배포 완료 후 아래 형태의 URL로 접속

```text
https://<github-id>.github.io/Helianthus-mobile-application/
```

