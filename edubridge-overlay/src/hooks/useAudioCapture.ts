import { useState, useRef } from 'react';

export const useAudioCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startCapture = async (source: 'mic' | 'tab' = 'mic') => {
    try {
      let audioStream: MediaStream;
      if (source === 'mic') {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        // Mock tab capture for PWA; in extension, message background.js
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          const response = await chrome.runtime.sendMessage({ action: 'captureTabAudio' });
          audioStream = new MediaStream(); // Mock; real impl uses response.streamId
          // Note: Actual tabCapture requires background service worker
        } else {
          // Fallback to mic for PWA
          audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      }
      setStream(audioStream);

      // Optional: Start recording for ASR chunks
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      // Handle dataavailable for blobs to ASR

      return audioStream;
    } catch (err) {
      console.error('Audio capture error:', err);
      throw err;
    }
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  return { stream, startCapture, stopCapture };
};
