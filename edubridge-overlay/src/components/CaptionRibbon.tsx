import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreVertical, Lock, Unlock } from 'lucide-react';
import { useOnlineBadge } from '../hooks/useOnlineBadge';

interface CaptionRibbonProps {
  mainCaption: string;
  simplifiedCaption: string;
  language: string;
  mode: 'Speech' | 'Sign-Lite' | 'Auto';
  opacity: number;
  fontSize: number;
  isLocked: boolean;
  onOpacityChange: (opacity: number) => void;
  onFontSizeChange: (size: number) => void;
  onLockToggle: () => void;
}

export const CaptionRibbon: React.FC<CaptionRibbonProps> = ({
  mainCaption,
  simplifiedCaption,
  language,
  mode,
  opacity,
  fontSize,
  isLocked,
  onOpacityChange,
  onFontSizeChange,
  onLockToggle,
}) => {
  const offlineBadge = useOnlineBadge();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        height: '96px',
        opacity: opacity / 100,
        fontSize: `${fontSize}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // High-contrast black
        color: 'white',
        padding: '1rem',
        transform: 'translateY(0)', // Stub for auto-offset from Meet toolbar
      }}
      role="status"
      aria-live="polite"
    >
      <Card className="h-full border-0 bg-transparent shadow-none">
        <CardContent className="h-full p-0 flex flex-col justify-between">
          {/* Main caption line */}
          <div className="text-xl font-bold mb-1" style={{ fontSize: `${fontSize + 2}px` }}>
            {mainCaption || 'Listening...'}
          </div>
          {/* Simplified line */}
          <div className="text-base opacity-90 mb-2" style={{ fontSize: `${fontSize}px` }}>
            {simplifiedCaption || ''}
          </div>
          {/* Chips row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{language}</Badge>
              <Badge variant="outline">{mode}</Badge>
              {offlineBadge}
            </div>
            {/* Options menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onOpacityChange(100)}>Opacity 100%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpacityChange(80)}>Opacity 80%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpacityChange(60)}>Opacity 60%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpacityChange(40)}>Opacity 40%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFontSizeChange(fontSize + 2)}>Font Size +</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFontSizeChange(fontSize - 2)}>Font Size -</DropdownMenuItem>
                <DropdownMenuItem onClick={onLockToggle}>
                  {isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                  {isLocked ? 'Unlock' : 'Lock'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
