
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generativeArtInspiration, GenerativeArtInspirationOutput } from '@/ai/flows/generative-art-inspiration';

const MOODS = ["Dreamy", "Energetic", "Melancholy", "Futuristic", "Nature", "Abstract"];

export function InspirationTool() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inspiration, setInspiration] = useState<GenerativeArtInspirationOutput | null>(null);

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const generateInspiration = async () => {
    if (selectedMoods.length === 0) return;
    setLoading(true);
    try {
      const result = await generativeArtInspiration({ keywords: selectedMoods });
      setInspiration(result);
    } catch (error) {
      console.error("Failed to generate inspiration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl border shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">Art Block? Get Inspired!</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {MOODS.map(mood => (
          <Badge
            key={mood}
            variant={selectedMoods.includes(mood) ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 active:scale-95 rounded-full px-3 py-1"
            onClick={() => toggleMood(mood)}
          >
            {mood}
          </Badge>
        ))}
      </div>

      <Button
        onClick={generateInspiration}
        disabled={loading || selectedMoods.length === 0}
        className="w-full mt-2 rounded-xl h-12 shadow-lg shadow-primary/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
        {inspiration ? "Refresh Idea" : "Ignite Creativity"}
      </Button>

      {inspiration && (
        <Card className="mt-2 bg-primary/5 border-primary/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-primary/60 tracking-widest">Theme</p>
              <p className="text-sm font-semibold">{inspiration.theme}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-primary/60 tracking-widest">Concept</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{inspiration.concept}</p>
            </div>
            <div className="pt-2 border-t border-primary/10">
              <p className="text-[10px] font-bold uppercase text-primary/60 tracking-widest">Prompt</p>
              <p className="text-xs italic text-foreground/80">"{inspiration.prompt}"</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
