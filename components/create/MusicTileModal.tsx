'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { type Tile } from '@/lib/types';

type MusicTileModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTileCreate: (tile: Omit<Tile, 'id' | 'entry_id'>) => void;
};

export function MusicTileModal({ isOpen, setIsOpen, onTileCreate }: MusicTileModalProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setResult(null);
    const res = await fetch('/api/generate/music', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query }),
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data); // The result now holds { type, imageUrl, content }
    }
    setIsLoading(false);
  };
  
  const handleSelect = () => {
      // **THE FIX IS HERE:**
      // We parse the 'content' string from the API response to get song/artist.
      const songData = JSON.parse(result.content);
      // Then, we create a *new* object that combines that data with the top-level imageUrl.
      const fullMusicData = {
          song: songData.song,
          artist: songData.artist,
          imageUrl: result.imageUrl // This is the crucial missing piece
      };
      
      // Finally, we stringify this complete object to store in our tile.
      const tileContent = JSON.stringify(fullMusicData);
      
      onTileCreate({ type: 'music', content: tileContent, order: 0 });
      setIsOpen(false);
      setResult(null);
      setQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Add Music Tile</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a song..." />
          <Button onClick={handleSearch} disabled={isLoading}>{isLoading ? '...' : 'Search'}</Button>
        </div>
        {result && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src={result.imageUrl} alt="album art" width={50} height={50} className="rounded-md" />
              <div>
                <p className="font-bold">{JSON.parse(result.content).song}</p>
                <p className="text-sm text-gray-400">{JSON.parse(result.content).artist}</p>
              </div>
            </div>
            <Button onClick={handleSelect}>Select</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
