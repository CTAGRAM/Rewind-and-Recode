# EduBridge Overlay Project TODO

## Overall Plan Breakdown
This TODO tracks progress on building the Chrome Extension (MV3) with shared React UI for PWA, based on the approved plan. Steps are sequential; update [x] as completed.

1. [ ] Initialize project structure: Create root files (package.json, vite.config.ts, tailwind.config.js, postcss.config.js, index.html, components.json).
2. [ ] Install dependencies: Run `npm install` for React, Vite, @crxjs/vite-plugin, Tailwind, Lottie, etc.
3. [ ] Configure shadcn/ui: Run `npx shadcn@latest init` and add components (Button, Card, Select, Badge, DropdownMenu, Sheet, Switch, Progress, Tooltip, etc.).
4. [x] Create src/ React structure:
   - [x] src/overlay/App.tsx: Root component mounting UI (Ribbon, Overlays, Buttons).
   - [ ] src/components/: CaptionRibbon.tsx, ISLAvatar.tsx, ControlsMetrics.tsx, ButtonsRow.tsx.
   - [ ] src/hooks/: useOverlayPosition.ts (drag/resize/snap/persist), useAudioCapture.ts (mic/tab), useChromeStorage.ts (per-origin), useKeyboardShortcuts.ts, useOnlineBadge.ts.
   - [ ] src/lib/: audio/ (stream adapters), api/ (ASR/transform/TTS clients/mocks), isl/ (Lottie loader/fallback), braille/ (.brf exporter), phrasePack.json (50+ phrases), demoSentences.json (10 seeded).
5. [ ] Create extension/ files:
   - [ ] manifest.json: MV3 with permissions, host_permissions, content_scripts, background service_worker, commands (shortcuts).
   - [ ] content.js: Inject shadow DOM #edubridge-root, mount React, message bridge to background, keyboard listeners.
   - [ ] background.js: Handle tabCapture for audio, permission prompts, message router.
   - [ ] content.css: Minimal global styles (if needed outside shadow).
6. [ ] Create assets:
   - [ ] public/isl/: Placeholder Lottie JSONs (neutral.json, phrase1.json, phrase2.json, phrase3.json).
   - [ ] public/icons/: Extension icons (16.png, 32.png, 48.png, 128.png - placeholders).
7. [ ] Implement functionality:
   - [ ] Audio input selector (mic/tab), real-time ASR pipeline (mock for demo).
   - [ ] Modes (Speech/Sign-Lite/Auto), language select, TTS toggle (Web Speech fallback).
   - [ ] ISL mapping from phrase-match, neutral loop fallback.
   - [ ] Metrics (confidence, match %, latency), privacy banner.
   - [ ] Buttons: Start/Stop, TTS, Braille export, Demo cycle, Settings sheet.
   - [ ] Ribbon: aria-live, two lines, chips (lang/mode/offline), options menu (opacity/font/lock).
   - [ ] Drag/resize/pin/close for overlays, auto-offset ribbon from Meet toolbar.
   - [ ] Keyboard shortcuts relay (M/S/B, Ctrl+↑/↓, Esc).
   - [ ] Error fallbacks: Toasts for API fails, demo mode offline.
8. [ ] Create PWA files:
   - [ ] public/manifest.webmanifest: For installable PWA.
   - [ ] src/sw.js: Service worker for offline caching (assets, demo data).
9. [ ] Create documentation:
   - [ ] README.md: Setup, modes, shortcuts, permissions, adding phrases/assets, PWA build.
10. [ ] Build and test:
    - [ ] Run `npm run build:extension` to generate dist/chrome-mv3/.
    - [ ] Load unpacked in Chrome, test injection on https://meet.google.com (use demo page if needed).
    - [ ] Verify: Overlay loads collapsed, one-click start, demo mode offline, drag/resize, TTS/.brf, metrics, WCAG high-contrast.
    - [ ] Test PWA: `npm run build` for dist/, serve and install.
11. [ ] Polish and finalize: Add high-contrast theme toggle, ensure no overlaps, update TODO as done.

Progress: Starting with step 1.
