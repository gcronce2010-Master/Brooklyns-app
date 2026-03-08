
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_COLORS = [
  '#E619AF', '#D026D0', '#F7F1F5', '#000000', 
  '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', 
  '#4CD964', '#5AC8FA', '#007AFF', '#5856D6'
];

interface ColorPaletteProps {
  brushColor: string;
  setBrushColor: (color: string) => void;
}

export function ColorPalette({ brushColor, setBrushColor }: ColorPaletteProps) {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [mixerColor, setMixerColor] = useState('#E619AF');

  const addCustomColor = () => {
    if (!customColors.includes(mixerColor)) {
      setCustomColors([mixerColor, ...customColors].slice(0, 12));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-2xl border shadow-sm">
      <div className="space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Palette</Label>
        <div className="grid grid-cols-4 gap-2">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setBrushColor(color)}
              className={cn(
                "w-full aspect-square rounded-lg transition-transform hover:scale-110 active:scale-95 border border-black/5 shadow-sm",
                brushColor === color && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          {customColors.map((color, i) => (
            <button
              key={`${color}-${i}`}
              onClick={() => setBrushColor(color)}
              className={cn(
                "w-full aspect-square rounded-lg transition-transform hover:scale-110 active:scale-95 border border-black/5 shadow-sm",
                brushColor === color && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color Mixer</Label>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Input
              type="color"
              value={mixerColor}
              onChange={(e) => setMixerColor(e.target.value)}
              className="w-12 h-12 p-1 rounded-xl cursor-pointer border-none"
            />
            <Pipette className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white mix-blend-difference pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <Input
            value={mixerColor}
            onChange={(e) => setMixerColor(e.target.value)}
            className="flex-1 text-xs font-mono uppercase h-12 bg-muted/30 border-none rounded-xl"
            placeholder="#000000"
          />
          <Button
            size="icon"
            variant="secondary"
            onClick={addCustomColor}
            className="w-12 h-12 rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
