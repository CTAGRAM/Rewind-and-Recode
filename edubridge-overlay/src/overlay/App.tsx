import React, { useEffect, useState } from 'react';
import { CaptionRibbon } from '../components/CaptionRibbon';
import { ISLAvatar } from '../components/ISLAvatar';
import { ControlsMetrics } from '../components/ControlsMetrics';
import { ButtonsRow } from '../components/ButtonsRow';
import { useOverlayPosition } from '../hooks/useOverlayPosition';
import { useAudioCapture } from '../hooks/useAudioCapture';
import { useChromeStorage } from '../hooks/useChromeStorage';
import { asr } from '../lib/api/asr';
import { transform } from '../lib/api/transform';
import { tts } from '../lib/api/tts';
import { exportBraille } from '../lib/braille';
import { loadLottie } from '../lib/isl';
import { demoCycle } from '../lib/demo';
import phrasePack from '../lib/phrasePack.json';
import demoSentences from '../lib/demoSentences.json';

// Types
interface Caption {
  main: string;
  simplified: string;
  lang: string;
  confidence: number;
}

interface Metrics {
  asrConfidence: number;
  phraseMatch: number;
  latency: number;
}

const App: React.FC = () => {
  // State
  const [caption, setCaption] = useState<Caption>({ main: '', simplified: '', lang: 'en', confidence: 0 });
  const [metrics, setMetrics] = useState<Metrics>({ asrConfidence: 0, phraseMatch: 0, latency: 0 });
  const [mode, setMode] = useState<'Speech' | 'Sign-Lite' | 'Auto'>('Auto');
  const [language, setLanguage] = useState<'mr-IN' | 'hi-IN' | 'en-US'>('en-US');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDemo, setIsDemo] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhraseId, setCurrentPhraseId] = useState('neutral');
  const [captionOpacity, setCaptionOpacity] = useState(100);
  const [captionFontSize, setCaptionFontSize] = useState(16);
  const [isCaptionLocked, setIsCaptionLocked] = useState(false);
  const [isAvatarPinned, setIsAvatarPinned] = useState(false);
  const [isAvatarMinimized, setIsAvatarMinimized] = useState(false);

  // Functions (moved before hooks to fix hoisting)
  const startRecording = async () => {
    try {
      const stream = await startCapture(); // Mic or tab
      setAudioStream(stream);
      setIsRecording(true);
      setIsCollapsed(false);
      // Start ASR pipeline (mock for now)
      processAudioStream(stream);
    } catch (err) {
      console.error('Audio capture failed:', err);
      // Fallback to demo
      setIsDemo(true);
      demoCycle(setCaption, setMetrics);
    }
  };

  const stopRecording = () => {
    stopCapture();
    setAudioStream(null);
    setIsRecording(false);
  };

  const processAudioStream = async (stream: MediaStream) => {
    // Mock real-time ASR
    const audioBlob = await recordToBlob(stream); // Placeholder
    const result = await asr(audioBlob, language); // API call
    if (result.text) {
      const transformed = await transform(result.text, language);
      const matchedPhrase = matchPhrase(transformed.simplified);
      setCaption({ main: transformed.translated, simplified: transformed.simplified, lang: language, confidence: result.confidence });
      setMetrics({ asrConfidence: result.confidence, phraseMatch: matchedPhrase?.score || 0, latency: result.latencyMs });
      if (matchedPhrase) {
        playISL(matchedPhrase.phraseId);
      } else {
        playNeutralISL();
      }
      if (ttsEnabled) {
        speak(transformed.simplified);
      }
    }
  };

  const matchPhrase = (text: string): { phraseId: string; score: number } | null => {
    // Simple pattern matching from phrasePack
    for (const phrase of (phrasePack as any).phrases) {
      const score = phrase.patterns.reduce((acc: number, pat: string) => acc + (text.includes(pat) ? 1 : 0), 0) / phrase.patterns.length;
      if (score > 0.5) return { phraseId: phrase.id, score };
    }
    return null;
  };

  const playISL = async (phraseId: string) => {
    const asset = (phrasePack as any).phrases.find((p: any) => p.id === phraseId)?.islAsset;
    if (asset) {
      await loadLottie(asset);
    } else {
      playNeutralISL();
    }
  };

  const playNeutralISL = () => {
    loadLottie('neutral.json');
  };

  const speak = async (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      speechSynthesis.speak(utterance);
    } else {
      // Fallback to TTS API
      const audioUrl = await tts(text, language);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const speakLastCaption = () => {
    if (caption.simplified) speak(caption.simplified);
  };

  const exportCurrentBraille = () => {
    if (caption.simplified) {
      const brfContent = exportBraille(caption.simplified);
      const blob = new Blob([brfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caption-${Date.now()}.brf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleDemo = () => {
    setIsDemo(!isDemo);
    if (!isDemo) {
      demoCycle(setCaption, setMetrics);
    }
  };

  const toggleHighContrast = (checked: boolean) => {
    setHighContrast(checked);
  };

  const updateFontSize = (delta: number) => {
    const currentSize = parseInt(getComputedStyle(document.body).fontSize) || 18;
    document.body.style.fontSize = `${Math.max(16, Math.min(32, currentSize + delta))}px`;
  };

  const hideOverlays = () => {
    setIsCollapsed(true);
  };

  // Placeholder recordToBlob (implement in lib/audio)
  const recordToBlob = async (stream: MediaStream): Promise<Blob> => {
    return new Blob([]); // Mock
  };

  // Hooks
  const avatarPosition = useOverlayPosition({ initialPosition: { x: 20, y: 20 }, keyPrefix: 'isl-avatar' });
  const controlsPosition = useOverlayPosition({ initialPosition: { x: window.innerWidth - 300, y: 20 }, keyPrefix: 'controls-metrics' });
  const { stream: audioStreamFromHook, startCapture, stopCapture } = useAudioCapture();
  const { getItem, setItem } = useChromeStorage();

  // Effects
  useEffect(() => {
    // Load persisted state
    getItem('highContrast').then((val) => val !== null && setHighContrast(JSON.parse(val)));
    getItem('language').then((val) => val !== null && setLanguage(val as 'mr-IN' | 'hi-IN' | 'en-US'));
    getItem('mode').then((val) => {
      if (val !== null) {
        const modeMap: Record<string, 'Speech' | 'Sign-Lite' | 'Auto'> = {
          'speech': 'Speech',
          'sign-lite': 'Sign-Lite',
          'auto': 'Auto'
        };
        setMode(modeMap[val] || 'Auto');
      }
    });
    getItem('collapsed').then((val) => val !== null && setIsCollapsed(JSON.parse(val)));
  }, []);

  useEffect(() => {
    // Persist state per origin
    const origin = window.location.hostname;
    setItem(`${origin}-highContrast`, highContrast);
    setItem(`${origin}-language`, language);
    setItem(`${origin}-mode`, mode);
    setItem(`${origin}-collapsed`, isCollapsed);
  }, [highContrast, language, mode, isCollapsed]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    // Online/offline detection for PWA badge
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Render
  if (isCollapsed && !isDemo) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => setIsCollapsed(false)} className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Start EduBridge
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none ${highContrast ? 'high-contrast' : ''}`}>
      <CaptionRibbon
        mainCaption={caption.main}
        simplifiedCaption={caption.simplified}
        language={language}
        mode={mode}
        opacity={captionOpacity}
        fontSize={captionFontSize}
        isLocked={isCaptionLocked}
        onOpacityChange={setCaptionOpacity}
        onFontSizeChange={setCaptionFontSize}
        onLockToggle={() => setIsCaptionLocked(prev => !prev)}
      />
      <ISLAvatar
        currentPhraseId={currentPhraseId}
        isPinned={isAvatarPinned}
        onPinToggle={() => setIsAvatarPinned(prev => !prev)}
        onMinimize={() => setIsAvatarMinimized(prev => !prev)}
        onClose={() => setIsCollapsed(true)}
        initialPosition={{ x: 20, y: 20 }}
        initialSize={{ width: 240, height: 240 }}
      />
      <ControlsMetrics
        language={language}
        onLanguageChange={(lang) => setLanguage(lang as 'mr-IN' | 'hi-IN' | 'en-US')}
        mode={mode}
        onModeChange={setMode}
        ttsEnabled={ttsEnabled}
        onTTSToggle={() => setTtsEnabled(prev => !prev)}
        onBrailleSave={exportCurrentBraille}
        asrConfidence={metrics.asrConfidence}
        phraseMatch={metrics.phraseMatch}
        latency={metrics.latency}
        isHighContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(prev => !prev)}
        onHelp={() => {}}
        initialPosition={{ x: window.innerWidth - 300, y: 20 }}
        initialSize={{ width: 280, height: 300 }}
      />
      <ButtonsRow
        isActive={isRecording}
        onStartStop={isRecording ? stopRecording : startRecording}
        onTTS={speakLastCaption}
        onBraille={exportCurrentBraille}
        onDemo={toggleDemo}
        onSettings={() => {}}
      />
    </div>
  );
};



const detectMeetToolbar = (): boolean => {
  return document.querySelector('.a4s aqi') !== null; // Mock selector for Meet toolbar
};

export default App;
