import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { HelpCircle, Mic, Volume2, FileText, Settings, Sun, Moon } from 'lucide-react';
import { useOverlayPosition } from '../hooks/useOverlayPosition';

interface ControlsMetricsProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  mode: 'Speech' | 'Sign-Lite' | 'Auto';
  onModeChange: (mode: 'Speech' | 'Sign-Lite' | 'Auto') => void;
  ttsEnabled: boolean;
  onTTSToggle: () => void;
  onBrailleSave: () => void;
  asrConfidence: number;
  phraseMatch: number;
  latency: number;
  isHighContrast: boolean;
  onHighContrastToggle: () => void;
  onHelp: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export const ControlsMetrics: React.FC<ControlsMetricsProps> = ({
  language,
  onLanguageChange,
  mode,
  onModeChange,
  ttsEnabled,
  onTTSToggle,
  onBrailleSave,
  asrConfidence,
  phraseMatch,
  latency,
  isHighContrast,
  onHighContrastToggle,
  onHelp,
  initialPosition = { x: window.innerWidth - 300, y: 20 },
  initialSize = { width: 280, height: 300 },
}) => {
  const { position, size, isDragging, startDrag, startResize } = useOverlayPosition(initialPosition, initialSize);

  return (
    <div
      className={`fixed z-40 ${isDragging ? 'pointer-events-none' : ''} ${isHighContrast ? 'high-contrast' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '250px',
        minHeight: '250px',
        maxWidth: '400px',
        maxHeight: '500px',
      }}
      role="complementary"
      aria-label="Controls and Metrics"
    >
      <Card className="h-full w-full border-2 border-secondary shadow-lg bg-card">
        {/* Drag handle */}
        <div
          className="flex items-center justify-between p-2 bg-secondary text-secondary-foreground cursor-move rounded-t-lg"
          onMouseDown={startDrag}
          role="button"
          aria-label="Drag to move"
        >
          <span className="text-sm font-medium">Controls & Metrics</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onHelp}
            className="h-6 w-6 p-0"
            aria-label="Help"
          >
            <HelpCircle className="h-3 w-3" />
          </Button>
        </div>
        <CardContent className="h-full p-0 overflow-y-auto">
          {/* Controls Section */}
          <div className="p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Language</label>
                <Select value={language} onValueChange={onLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="hi-IN">Hindi</SelectItem>
                    <SelectItem value="mr-IN">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mode</label>
                <Select value={mode} onValueChange={(val) => onModeChange(val as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Speech">Speech</SelectItem>
                    <SelectItem value="Sign-Lite">Sign-Lite</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">TTS</label>
                <Switch checked={ttsEnabled} onCheckedChange={onTTSToggle} />
              </div>
              <Button onClick={onBrailleSave} className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Save .brf
              </Button>
            </div>
          </div>
          <Separator />
          {/* Metrics Section */}
          <div className="p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg">Metrics</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">ASR Confidence</label>
                <Progress value={asrConfidence} className="w-full" />
                <span className="text-xs text-muted-foreground">{asrConfidence}%</span>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phrase-Match</label>
                <Progress value={phraseMatch} className="w-full" />
                <span className="text-xs text-muted-foreground">{phraseMatch}%</span>
              </div>
              <Badge variant={latency <= 3000 ? 'default' : 'destructive'}>
                Latency: {latency}ms {latency <= 3000 ? '✅' : '⚠️'}
              </Badge>
            </div>
          </div>
          <Separator />
          {/* Privacy */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground">
              Hackathon mode uses APIs; no storage
            </p>
          </div>
          <Separator />
          {/* System Section */}
          <div className="p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg">System</CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">High-contrast</label>
              <Switch checked={isHighContrast} onCheckedChange={onHighContrastToggle} />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Help & Shortcuts</SheetTitle>
                </SheetHeader>
                <div className="text-sm space-y-2">
                  <p>M: Start/Stop | S: TTS | B: Braille | Esc: Hide</p>
                  <p>Ctrl/Cmd + ↑/↓: Font size | Drag cards to move</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-secondary opacity-50 hover:opacity-100"
          onMouseDown={startResize}
          role="button"
          aria-label="Resize"
        />
      </Card>
    </div>
  );
};
