
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  brushType: 'round' | 'square' | 'marker';
  isEraser: boolean;
  onCanvasChange?: () => void;
  className?: string;
}

export function DrawingCanvas({
  brushColor,
  brushSize,
  brushOpacity,
  brushType,
  isEraser,
  onCanvasChange,
  className
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize and handle resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx && canvas.width > 0 && canvas.height > 0) {
          tempCtx.drawImage(canvas, 0, 0);
        }

        const newWidth = parent.clientWidth;
        const newHeight = parent.clientHeight;

        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.lineCap = brushType === 'square' ? 'square' : 'round';
            ctx.lineJoin = 'round';
            if (tempCanvas.width > 0 && tempCanvas.height > 0) {
              ctx.drawImage(tempCanvas, 0, 0);
            }
          }
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [brushType]);

  const getCoordinates = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    // Only allow primary pointer button (left click)
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setLastPos(coords);
    
    // Set up initial point for dots/single clicks
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      draw(e, true);
    }
  };

  const draw = (e: React.PointerEvent, isInitial = false) => {
    if (!isDrawing && !isInitial) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(coords.x, coords.y);

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = brushOpacity / 100;
      
      if (brushType === 'marker') {
        ctx.lineCap = 'butt';
        ctx.lineWidth = brushSize * 1.5;
      } else {
        ctx.lineCap = brushType === 'square' ? 'square' : 'round';
      }
    }

    ctx.stroke();
    setLastPos(coords);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onCanvasChange?.();
    }
  };

  return (
    <div className={cn("relative w-full h-full bg-white rounded-xl overflow-hidden cursor-crosshair", className)}>
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={(e) => draw(e)}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        onPointerCancel={stopDrawing}
        className="w-full h-full touch-none"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
