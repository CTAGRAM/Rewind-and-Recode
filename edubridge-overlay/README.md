# EduBridge Overlay — Meet/Zoom Companion

A Chrome Extension (MV3) that injects a draggable, resizable overlay UI over meet.google.com/* and *.zoom.us/wc/*, using shadcn/ui components. The UI is modular for reuse as a standalone PWA.

## Features

- **Caption Ribbon**: Bottom full-width, high-contrast, multilingual captions with simplified line, language/mode chips, offline badge, options menu (opacity, font size, lock).
- **ISL Avatar Overlay**: Top-left, 240x240 resizable card with Lottie animations for phrase mapping, drag handle, pin/close/minimize.
- **Controls & Metrics Overlay**: Top-right, 280x300 resizable card with language/mode/TTS toggles, metrics (ASR confidence, phrase-match, latency), privacy banner, high-contrast switch, help button.
- **Buttons Row**: Bottom-center, Start/Stop audio, TTS, Braille export, Demo, Settings sheet.
- **Modes**: Speech (STT→Caption), Sign-Lite (phrase recognition→Caption/TTS), Auto (detect signal).
- **Audio Input**: Mic or tab audio (via chrome.tabCapture).
- **APIs (Hackathon)**: Mock /api/asr, /api/transform, /api/tts; replace with OpenAI or offline in production.
- **Demo Mode**: Offline, cycles 10 seeded sentences + 3 ISL clips.
- **Braille Export**: .brf file from simplified line.
- **State Persistence**: Overlay positions/sizes, language/mode, high-contrast per origin (chrome.storage.local).
- **Keyboard Shortcuts**: M (Start/Stop), S (TTS), B (Braille), Esc (hide), Ctrl/Cmd + ↑/↓ (font size).
- **A11y**: WCAG AA, high-contrast, aria-live captions, keyboard nav, no color cues.
- **PWA Reusability**: Same React UI in floating window, offline-ready with service worker.

## Setup

1. **Install Dependencies**:
   ```
   cd edubridge-overlay
   npm install
   ```

2. **Build Extension**:
   ```
   npm run build:extension
   ```
   Loads to `dist/chrome-mv3/`. In Chrome: chrome://extensions/ > Load unpacked > select dist/chrome-mv3.

3. **Test on Meet/Zoom**:
   - Navigate to meet.google.com or zoom.us/wc.
   - Overlay loads collapsed; click to start (requests audio permissions).
   - Use Demo mode for offline testing.

4. **Build PWA**:
   ```
   npm run build
   ```
   Serve `dist/` (e.g., `npx serve dist`) and install as PWA.

5. **Dev Mode**:
   ```
   npm run dev
   ```
   For PWA testing at localhost:5173.

## Permissions

- `tabCapture`: Capture tab audio for ASR.
- `storage`: Persist UI state.
- `activeTab`, `scripting`: Inject on matching URLs.
- Host permissions for Meet/Zoom.

## Keyboard Shortcuts

- `M`: Start/Stop audio.
- `S`: TTS last line.
- `B`: Save .brf.
- `Esc`: Hide overlays.
- `Ctrl/Cmd + ↑/↓`: Adjust font size.

## Adding Phrases/Assets

- **Phrase Pack**: Edit `src/lib/phrasePack.json` – add {phraseId, patterns: [regex], islAsset: 'isl/phraseX.json'}.
- **Demo Sentences**: Edit `src/lib/demoSentences.json` – add {id, lang, spoken, simplified, phraseId}.
- **ISL Clips**: Add Lottie JSON to `public/isl/`, reference in phrasePack.
- Rebuild after changes.

## Modes & APIs

- **Speech**: Audio → ASR → transform → caption/TTS.
- **Sign-Lite**: Phrase match from local map → ISL clip.
- **Auto**: Detects audio/signal, switches modes.
- Hackathon: Mocks in `src/lib/api/`; update endpoints for real APIs (e.g., OpenAI Whisper for ASR).

## Non-Goals (v1)

- Generative ISL.
- Desktop Zoom injection.
- Auto-mic start (requires user click for permissions).

## Troubleshooting

- **No Injection**: Check URL matches, reload extension.
- **Audio Fails**: Grant mic/tab permissions; fallback to demo.
- **TTS Fails**: Uses Web Speech API fallback.
- **Build Errors**: Run `npm run check` for TS issues.

For production, replace mocks with offline engines (e.g., WebAssembly ASR/TTS).
