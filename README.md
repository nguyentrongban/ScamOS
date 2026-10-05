# ScamOS

ScamOS is a fictional desktop-computer simulation game built with React + Vite + Tailwind CSS.

## Stack

- React
- Vite
- Tailwind CSS
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Vercel should detect Vite automatically.
4. Build command: `npm run build`
5. Output directory: `dist`

The included `vercel.json` keeps the single-page app working on direct routes.

## Project structure

```text
src/
  apps/
    FakeProofStudio.jsx
    ScamNotes.jsx
    ShadowWallet.jsx
    TeleCRM.jsx
  components/
    DesktopIcon.jsx
    StartMenu.jsx
    Taskbar.jsx
    Window.jsx
  data/
    contacts.js
  App.jsx
  main.jsx
  styles/
    index.css
```

This is intentionally UI-first so gameplay systems, saves, authentication, networking and multiplayer can be added later without replacing the desktop architecture.
