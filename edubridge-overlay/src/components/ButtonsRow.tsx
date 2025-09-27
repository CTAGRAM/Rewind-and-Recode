import React from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Play, Square, Volume2, FileText, PlayCircle, Settings } from 'lucide-react';

interface ButtonsRowProps {
  isActive: boolean;
  onStartStop: () => void;
  onTTS: () => void;
  onBraille: () => void;
  onDemo: () => void;
  onSettings: () => void;
}

export const ButtonsRow: React.FC<ButtonsRowProps> = ({
  isActive,
  onStartStop,
  onTTS,
  onBraille,
  onDemo,
  onSettings,
}) => {
  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 flex items-center space-x-2 bg-black bg-opacity-80 p-2 rounded-lg shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onStartStop}
              variant={isActive ? 'destructive' : 'default'}
              size="sm"
              className="h-10 w-10 p-0"
              aria-label={isActive ? 'Stop' : 'Start'}
            >
              {isActive ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isActive ? 'Stop (M)' : 'Start (M)'}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onTTS}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
              aria-label="TTS"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>TTS (S)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onBraille}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
              aria-label="Braille"
            >
              <FileText className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Braille (B)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDemo}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
              aria-label="Demo"
            >
              <PlayCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Demo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSettings}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
