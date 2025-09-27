import React, { useState, useEffect, useCallback } from 'react';
import { useChromeStorage } from './useChromeStorage';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface UseOverlayPositionProps {
  initialPosition?: Position;
  initialSize?: Size;
  keyPrefix?: string; // For storage key, e.g., 'isl-avatar'
}

interface UseOverlayPositionReturn {
  position: Position;
  size: Size;
  isDragging: boolean;
  isResizing: boolean;
  startDrag: (e: React.MouseEvent) => void;
  startResize: (e: React.MouseEvent) => void;
}

export const useOverlayPosition = ({
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 240, height: 240 },
  keyPrefix = 'overlay',
}: UseOverlayPositionProps): UseOverlayPositionReturn => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [size, setSize] = useState<Size>(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const [resizeStart, setResizeStart] = useState<Position | null>(null);
  const [startSize, setStartSize] = useState<Size | null>(null);

  const { getItem, setItem } = useChromeStorage();

  // Load from storage on mount
  useEffect(() => {
    const loadPosition = async () => {
      const saved = await getItem(`${keyPrefix}-position`);
      if (saved) setPosition(JSON.parse(saved));
    };
    const loadSize = async () => {
      const saved = await getItem(`${keyPrefix}-size`);
      if (saved) setSize(JSON.parse(saved));
    };
    loadPosition();
    loadSize();
  }, [keyPrefix, getItem]);

  // Save to storage on change
  useEffect(() => {
    setItem(`${keyPrefix}-position`, JSON.stringify(position));
  }, [position, keyPrefix, setItem]);

  useEffect(() => {
    setItem(`${keyPrefix}-size`, JSON.stringify(size));
  }, [size, keyPrefix, setItem]);

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setStartSize(size);
  }, [size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragStart) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
    if (isResizing && resizeStart && startSize) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      setSize({
        width: Math.max(200, startSize.width + deltaX),
        height: Math.max(200, startSize.height + deltaY),
      });
    }
  }, [isDragging, dragStart, isResizing, resizeStart, startSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
    setResizeStart(null);
    setStartSize(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return {
    position,
    size,
    isDragging,
    isResizing,
    startDrag,
    startResize,
  };
};
