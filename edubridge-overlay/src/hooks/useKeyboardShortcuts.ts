import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onStartStop: () => void;
  onTTS: () => void;
  onBraille: () => void;
  onHide: () => void;
  onFontUp: () => void;
  onFontDown: () => void;
}

export const useKeyboardShortcuts = ({
  onStartStop,
  onTTS,
  onBraille,
  onHide,
  onFontUp,
  onFontDown,
}: KeyboardShortcutsProps) => {
  const handleShortcut = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case ' ': // Space for start/stop
          event.preventDefault();
          onStartStop();
          break;
        case 't': // Ctrl+T for TTS
          event.preventDefault();
          onTTS();
          break;
        case 'b': // Ctrl+B for Braille
          event.preventDefault();
          onBraille();
          break;
        case 'h': // Ctrl+H for hide
          event.preventDefault();
          onHide();
          break;
        case '+': // Ctrl++ for font up
          event.preventDefault();
          onFontUp();
          break;
        case '-': // Ctrl+- for font down
          event.preventDefault();
          onFontDown();
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [onStartStop, onTTS, onBraille, onHide, onFontUp, onFontDown]);

  return { handleShortcut };
};
