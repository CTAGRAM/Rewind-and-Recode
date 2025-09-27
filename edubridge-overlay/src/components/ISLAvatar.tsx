import React from 'react';
import Lottie from 'lottie-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, Pin, X, Minimize2 } from 'lucide-react';
import { useOverlayPosition } from '../hooks/useOverlayPosition';

interface ISLAvatarProps {
  currentPhraseId: string;
  isPinned: boolean;
  onPinToggle: () => void;
  onMinimize: () => void;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export const ISLAvatar: React.FC<ISLAvatarProps> = ({
  currentPhraseId,
  isPinned,
  onPinToggle,
  onMinimize,
  onClose,
  initialPosition = { x: 20, y: 20 },
  initialSize = { width: 240, height: 240 },
}) => {
  const { position, size, isDragging, startDrag, startResize } = useOverlayPosition(initialPosition, initialSize);

  // Load Lottie animation path (fallback to neutral)
  const animationPath = currentPhraseId ? `/isl/${currentPhraseId}.json` : '/isl/neutral.json';

  return (
    <div
      className={`fixed z-40 ${isDragging ? 'pointer-events-none' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '200px',
        minHeight: '200px',
        maxWidth: '400px',
        maxHeight: '400px',
      }}
      role="img"
      aria-label={`ISL Avatar: ${currentPhraseId || 'Neutral signing'}`}
    >
      <Card className="h-full w-full border-2 border-primary shadow-lg bg-card high-contrast" style={{ opacity: 1 }}>
        {/* Drag handle */}
        <div
          className="flex items-center justify-between p-2 bg-primary text-primary-foreground cursor-move rounded-t-lg"
          onMouseDown={startDrag}
          role="button"
          aria-label="Drag to move"
        >
          <GripVertical className="h-4 w-4" />
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPinToggle}
              className="h-6 w-6 p-0"
              aria-label={isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0"
              aria-label="Minimize"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {/* Lottie viewport */}
        <CardContent className="h-full p-0 flex flex-col items-center justify-center">
          <div className="w-full h-[200px] relative">
            <Lottie
              animationData={undefined} // Vite will load from path
              path={animationPath}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          {/* Phrase label */}
          <div className="p-2 text-center text-sm font-medium text-foreground">
            {currentPhraseId || 'Signing...'}
          </div>
        </CardContent>
        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-primary opacity-50 hover:opacity-100"
          onMouseDown={startResize}
          role="button"
          aria-label="Resize"
        />
      </Card>
    </div>
  );
};
