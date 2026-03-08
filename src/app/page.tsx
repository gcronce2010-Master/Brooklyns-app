
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { DrawingCanvas } from '@/components/drawing-canvas';
import { BrushToolkit } from '@/components/brush-toolkit';
import { ColorPalette } from '@/components/color-palette';
import { InspirationTool } from '@/components/inspiration-tool';
import { ArtworkGallery } from '@/components/artwork-gallery';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  Save, 
  Undo, 
  Redo, 
  RotateCcw,
  Palette as PaletteIcon,
  Brush as BrushIcon,
  Sparkles,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function CanvasCraftStudio() {
  const [brushColor, setBrushColor] = useState('#E619AF');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushType, setBrushType] = useState<'round' | 'square' | 'marker'>('round');
  const [isEraser, setIsEraser] = useState(false);
  const [lastChange, setLastChange] = useState(Date.now());
  const { toast } = useToast();

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const saved = JSON.parse(localStorage.getItem('canvascraft_art') || '[]');
    const newArt = {
      id: Date.now().toString(),
      name: `Masterpiece ${saved.length + 1}`,
      dataUrl,
      timestamp: Date.now()
    };
    
    localStorage.setItem('canvascraft_art', JSON.stringify([newArt, ...saved]));
    setLastChange(Date.now());
    
    toast({
      title: "Artwork Saved!",
      description: "Your creation has been added to your studio gallery.",
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `canvascraft-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'art.png', { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({
            title: 'My Artwork from CanvasCraft',
            files: [file],
          });
        } else {
          toast({
            title: "Sharing not supported",
            description: "Try downloading the image instead!",
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setLastChange(Date.now());
    }
  };

  const handleLoadArt = (dataUrl: string) => {
    const canvas = canvasRef.current?.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setLastChange(Date.now());
      };
      img.src = dataUrl;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 px-6 bg-white border-b flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 transform -rotate-3">
              <BrushIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Canvas<span className="text-accent">Craft</span> <span className="text-muted-foreground font-light text-sm hidden sm:inline-block ml-2">Studio</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Undo className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Redo className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={clearCanvas}>
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Canvas</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-6 bg-border mx-2" />

            <Button onClick={handleSave} className="rounded-full px-5 h-10 gap-2">
              <Save className="w-4 h-4" /> Save
            </Button>
            <Button onClick={handleDownload} variant="secondary" className="rounded-full px-5 h-10 gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button onClick={handleShare} variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Toolbar */}
          <aside className="w-[300px] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar z-20 shrink-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Toolkit</span>
              </div>
              <BrushToolkit
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                brushOpacity={brushOpacity}
                setBrushOpacity={setBrushOpacity}
                brushType={brushType}
                setBrushType={setBrushType}
                isEraser={isEraser}
                setIsEraser={setIsEraser}
              />
              <ColorPalette
                brushColor={brushColor}
                setBrushColor={setBrushColor}
              />
            </div>
          </aside>

          {/* Canvas Section */}
          <main className="flex-1 p-4 bg-muted/20 relative z-10 flex flex-col">
            <div ref={canvasRef} className="flex-1 bg-white rounded-[2rem] shadow-xl overflow-hidden canvas-container border-8 border-white">
              <DrawingCanvas
                brushColor={brushColor}
                brushSize={brushSize}
                brushOpacity={brushOpacity}
                brushType={brushType}
                isEraser={isEraser}
                onCanvasChange={() => setLastChange(Date.now())}
              />
            </div>
            
            {/* Quick Palette Overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/80 backdrop-blur-md rounded-2xl border shadow-xl z-30">
               {['#E619AF', '#D026D0', '#5AC8FA', '#4CD964', '#FFCC00'].map(c => (
                 <button 
                  key={c}
                  onClick={() => { setBrushColor(c); setIsEraser(false); }}
                  className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-125 ${brushColor === c && !isEraser ? 'scale-110 border-white ring-2 ring-primary' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                 />
               ))}
               <div className="w-px h-6 bg-border mx-1" />
               <button 
                onClick={() => setIsEraser(true)}
                className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-125 flex items-center justify-center ${isEraser ? 'bg-primary text-white scale-110 border-white ring-2 ring-primary' : 'bg-muted text-muted-foreground border-transparent'}`}
               >
                 <Layers className="w-4 h-4" />
               </button>
            </div>
          </main>

          {/* Right Inspiration & Studio Side */}
          <aside className="w-[300px] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar z-20 shrink-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Creativity</span>
              </div>
              <InspirationTool />
              <ArtworkGallery 
                onLoadArt={handleLoadArt}
                lastChange={lastChange}
              />
            </div>
          </aside>
        </div>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}
