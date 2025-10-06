'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type Tile } from '@/lib/types';

type WorkoutTileModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTileCreate: (tile: Omit<Tile, 'id' | 'entry_id'>) => void;
};

export function WorkoutTileModal({ isOpen, setIsOpen, onTileCreate }: WorkoutTileModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    const res = await fetch('/api/generate/workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      const data = await res.json();
      // --- THE FINAL FIX IS HERE ---
      // We stringify the workout content object to ensure it's a string, just like the music tile.
      const tileContent = JSON.stringify(data.content);
      onTileCreate({ type: 'workout', content: tileContent, order: 0 });
      setIsOpen(false);
      setPrompt('');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Add Workout Tile</DialogTitle>
        </DialogHeader>
        <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Morning run 5km" />
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : 'Add Tile'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
