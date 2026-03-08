
"use client";

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Brush, Eraser, Square, Circle, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrushToolkitProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushOpacity: number;
  setBrushOpacity: (opacity: number) => void;
  brushType: 'round' | 'square' | 'marker';
  setBrushType: (type: 'round' | 'square' | 'marker') => void;
  isEraser: boolean;
  setIsEraser: (is: boolean) => void;
}

export function BrushToolkit({
  brushSize, setBrushSize,
  brushOpacity, setBrushOpacity,
  brushType, setBrushType,
  isEraser, setIsEraser
}: BrushToolkitProps) {
  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-2xl border shadow-sm">
      <div className="space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools</Label>
        <div className="flex gap-2">
          <Button
            variant={!isEraser ? "default" : "outline"}
            size="icon"
            onClick={() => setIsEraser(false)}
            className={cn("w-12 h-12 rounded-xl transition-all", !isEraser && "scale-105 shadow-lg shadow-primary/20")}
          >
            <Brush className="w-5 h-5" />
          </Button>
          <Button
            variant={isEraser ? "default" : "outline"}
            size="icon"
            onClick={() => setIsEraser(true)}
            className={cn("w-12 h-12 rounded-xl transition-all", isEraser && "scale-105 shadow-lg shadow-primary/20")}
          >
            <Eraser className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {!isEraser && (
        <>
          <div className="space-y-4">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brush Type</Label>
            <div className="flex gap-2">
              <Button
                variant={brushType === 'round' ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setBrushType('round')}
                className={cn("w-10 h-10", brushType === 'round' && "bg-primary/10 text-primary")}
              >
                <Circle className="w-4 h-4 fill-current" />
              </Button>
              <Button
                variant={brushType === 'square' ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setBrushType('square')}
                className={cn("w-10 h-10", brushType === 'square' && "bg-primary/10 text-primary")}
              >
                <Square className="w-4 h-4 fill-current" />
              </Button>
              <Button
                variant={brushType === 'marker' ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setBrushType('marker')}
                className={cn("w-10 h-10", brushType === 'marker' && "bg-primary/10 text-primary")}
              >
                <PenTool className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</Label>
              <span className="text-xs font-medium text-primary">{brushSize}px</span>
            </div>
            <Slider
              value={[brushSize]}
              min={1}
              max={100}
              step={1}
              onValueChange={(val) => setBrushSize(val[0])}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opacity</Label>
              <span className="text-xs font-medium text-primary">{brushOpacity}%</span>
            </div>
            <Slider
              value={[brushOpacity]}
              min={1}
              max={100}
              step={1}
              onValueChange={(val) => setBrushOpacity(val[0])}
            />
          </div>
        </>
      )}
    </div>
  );
}
