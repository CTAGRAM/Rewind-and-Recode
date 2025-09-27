// Background service worker for EduBridge Overlay
// Handles tabCapture for audio, permission prompts, and message routing

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'startAudioCapture') {
    const tabId = sender.tab?.id;
    if (!tabId) {
      sendResponse({ error: 'No tab ID' });
      return;
    }

    // Request tabCapture permission if not granted
    chrome.permissions.request({ permissions: ['tabCapture'] }, (granted) => {
      if (!granted) {
        sendResponse({ error: 'tabCapture permission denied' });
        return;
      }

      // Capture tab audio
      chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
        if (chrome.runtime.lastError || !stream) {
          sendResponse({ error: chrome.runtime.lastError?.message || 'Failed to capture audio' });
          return;
        }

        // Create MediaStream from streamId (for extension compatibility)
        const audioStream = new MediaStream(stream.getAudioTracks());
        sendResponse({ streamId: stream.id, stream });
      });
    });

    return true; // Keep message channel open for async response
  }

  if (message.type === 'stopAudioCapture') {
    // Stop the stream if active
    if (message.streamId) {
      chrome.tabCapture.getMediaStreamIdForTab(sender.tab.id, (streamId) => {
        if (streamId === message.streamId) {
          // Stop tracks
          const stream = message.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      });
    }
    sendResponse({ success: true });
  }

  if (message.type === 'getMicStream') {
    // Fallback to microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      sendResponse({ stream });
    }).catch(err => {
      sendResponse({ error: err.message });
    });
    return true;
  }

  // Handle command shortcuts if needed (relay to content script)
  if (message.type === 'command') {
    chrome.tabs.sendMessage(sender.tab.id, { type: `command-${message.command}` });
  }
});

// Handle command shortcuts
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: `command-${command}` });
    }
  });
});

// Listen for tab updates to auto-inject or manage state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && (tab.url.includes('meet.google.com') || tab.url.includes('zoom.us/wc'))) {
    // Send message to content script to initialize overlay (collapsed)
    chrome.tabs.sendMessage(tabId, { type: 'initializeOverlay' });
  }
});
