
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Save current content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineCap = brushType === 'square' ? 'square' : 'round';
          ctx.lineJoin = 'round';
          // Restore content
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [brushType]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setLastPos(coords);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

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
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full touch-none"
      />
    </div>
  );
}
