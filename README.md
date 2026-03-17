# Component Library Manager (CLM)

Eigenständige Web-App zur Verwaltung von UI-Komponenten inkl. Varianten, Prop-Definitionen, Live-Preview und AI-fähigen Exporten (JSON / Markdown / Prompt-Template).

## Stack

- React + TypeScript + Vite
- Zustand (Persistenz via LocalStorage)
- Tailwind CSS
- Monaco Editor

## Features (MVP)

- Komponenten-CRUD (Name, Kategorie, Beschreibung, Framework)
- Prop-CRUD (string, number, boolean, enum)
- Varianten-CRUD mit Code-Editor (JSX/HTML/CSS)
- Live-Preview in iFrame inkl. Prop-Controls
- Exporte:
  - `ui-library.json`
  - `ui-library.md`
  - Prompt-Template (Clipboard)

## Lokaler Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

Dieses Repo enthält einen Workflow unter `.github/workflows/deploy-pages.yml`, der die App mit Vite baut und `dist/` nach GitHub Pages deployed.

Empfohlene Einstellung in GitHub:

- `Settings → Pages → Source: GitHub Actions`

## Docker

```bash
docker build -t clm .
docker run --rm -p 8080:80 clm
```

Dann im Browser öffnen: `http://localhost:8080`
