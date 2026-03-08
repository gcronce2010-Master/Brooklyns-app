
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image as ImageIcon, Trash2, FolderOpen, Save, Download, Share2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SavedArt {
  id: string;
  name: string;
  dataUrl: string;
  timestamp: number;
}

export function ArtworkGallery({ 
  onLoadArt,
  lastChange 
}: { 
  onLoadArt: (dataUrl: string) => void;
  lastChange?: number;
}) {
  const [artworks, setArtworks] = useState<SavedArt[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('brooklyns_craft_art');
    if (saved) {
      try {
        setArtworks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved art", e);
      }
    }
  }, [lastChange]);

  const deleteArt = (id: string) => {
    const updated = artworks.filter(a => a.id !== id);
    setArtworks(updated);
    localStorage.setItem('brooklyns_craft_art', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl border shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">Your Studio</h3>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase">{artworks.length} items</span>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        {artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground">No masterpieces yet.</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Draw something and hit save!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-4">
            {artworks.map((art) => (
              <div key={art.id} className="group relative bg-muted/20 rounded-xl overflow-hidden border border-transparent hover:border-primary/20 transition-all hover:shadow-md">
                <div className="aspect-[4/3] relative">
                  <img
                    src={art.dataUrl}
                    alt={art.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => onLoadArt(art.dataUrl)}
                    >
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => deleteArt(art.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-[11px] font-medium truncate">{art.name}</p>
                  <p className="text-[9px] text-muted-foreground">{new Date(art.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-4 border-t">
          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-4">Inspiration Board</p>
          <div className="grid grid-cols-2 gap-2">
            {PlaceHolderImages.slice(0, 4).map(img => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer group">
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
