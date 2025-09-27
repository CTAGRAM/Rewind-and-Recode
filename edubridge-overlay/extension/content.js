// Content script for EduBridge Overlay
// Injects shadow DOM root and mounts React app on matching pages

// Check if on matching URL
if (!window.location.href.includes('meet.google.com') && !window.location.href.includes('zoom.us/wc')) {
  return;
}

// Create root container
const rootContainer = document.createElement('div');
rootContainer.id = 'edubridge-root';
document.body.appendChild(rootContainer);

// Attach shadow DOM to avoid CSS conflicts
const shadow = rootContainer.attachShadow({ mode: 'open' });

// Inject minimal Tailwind CSS for shadow DOM (bundled or CDN fallback)
const style = document.createElement('style');
style.textContent = `
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  /* High-contrast styles from src/index.css */
  :host {
    all: initial;
    display: block;
  }
  /* Add index.css content here or bundle */
`;
shadow.appendChild(style);

// Mount React app to shadow root
const mountPoint = document.createElement('div');
mountPoint.id = 'shadow-root';
shadow.appendChild(mountPoint);

// Import and render React app
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/overlay/App.tsx';

// Create root and render
const appRoot = ReactDOM.createRoot(mountPoint);
appRoot.render(<App />);

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'initializeOverlay') {
    // Set initial collapsed state from storage
    // ...
  }

  if (message.type === 'streamReady') {
    // Receive audio stream from background and pass to hook
    // e.g., window.dispatchEvent(new CustomEvent('audioStream', { detail: message.stream }));
  }

  if (message.type.startsWith('command-')) {
    const command = message.type.replace('command-', '');
    // Dispatch to React app, e.g., via custom event
    window.dispatchEvent(new CustomEvent('keyboardCommand', { detail: command }));
  }
});

// Listen for keyboard shortcuts (fallback if commands not working)
document.addEventListener('keydown', (e) => {
  // Handle M, S, B, Esc, Ctrl+Up/Down
  if (e.key === 'm' || e.key === 'M') {
    e.preventDefault();
    chrome.runtime.sendMessage({ type: 'command', command: 'start-stop' });
  }
  // Similar for others
});

// Handle one-click start for audio permissions
let isInitialized = false;
function initializeOverlay() {
  if (isInitialized) return;
  isInitialized = true;

  // Show collapsed overlay
  rootContainer.style.display = 'none'; // Initial collapsed

  // Listen for user click to start
  rootContainer.addEventListener('click', () => {
    if (rootContainer.style.display === 'none') {
      rootContainer.style.display = 'block';
      chrome.runtime.sendMessage({ type: 'startAudioCapture' });
    }
  }, { once: true });
}

initializeOverlay();

// Persist collapse state
chrome.storage.local.get(['edubridge-collapse'], (result) => {
  if (result['edubridge-collapse']) {
    rootContainer.style.display = 'none';
  }
});

// On unload, save state
window.addEventListener('beforeunload', () => {
  chrome.storage.local.set({ 'edubridge-collapse': rootContainer.style.display === 'none' });
});
