'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Tile } from '@/lib/types';

// We'll create these modal components in the next steps
import { MusicTileModal } from '@/components/create/MusicTileModal';
import { WorkoutTileModal } from '@/components/create/WorkoutTileModal';
import { ImageTileModal } from '@/components/create/ImageTileModal';

export default function CreateEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tiles, setTiles] = useState<Omit<Tile, 'id' | 'entry_id'>[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMusicModalOpen, setMusicModalOpen] = useState(false);
  const [isWorkoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const addTile = (tile: Omit<Tile, 'id' | 'entry_id'>) => {
    setTiles(prev => [...prev, { ...tile, order: prev.length }]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tiles.length === 0) {
      setError('Please add at least one content tile.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const newEntryPayload = { title, description, tiles };

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newEntryPayload),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setTiles([]);
        window.location.href = '/'; // or use router.push('/') for SPA navigation
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create entry.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-[#7979792d] border-0 text-white">
          <CardHeader>
            <CardTitle className="text-3xl  font-bold">Create New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-[#8b8b8b34] border-0 text-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#8b8b8b34] border-0" />
              </div>
              
              <div>
                <Label className="text-lg">Content Tiles</Label>
                <div className="p-4 mt-2 bg-[#8b8b8b34] rounded-lg min-h-[50px]">
                  {/* Preview of tiles will go here */}
                  {tiles.length === 0 ? (
                     <p className="text-center text-gray-300">Add content using the buttons below.</p>
                  ): (
                    <div className="grid grid-cols-4 gap-2">
                      {tiles.map((tile, index) => <div key={index} className="aspect-square bg-purple-900 rounded-md flex items-center justify-center text-xs p-1">{tile.type}</div>)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                  <Button type="button" onClick={() => setMusicModalOpen(true)}>Add Music</Button>
                  <Button type="button" onClick={() => setWorkoutModalOpen(true)}>Add Workout</Button>
                  <Button type="button" onClick={() => setImageModalOpen(true)}>Add Image</Button>
              </div>

              {error && <p className="text-red-400">{error}</p>}

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.push('/')}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Entry'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <MusicTileModal isOpen={isMusicModalOpen} setIsOpen={setMusicModalOpen} onTileCreate={addTile} />
      <WorkoutTileModal isOpen={isWorkoutModalOpen} setIsOpen={setWorkoutModalOpen} onTileCreate={addTile} />
      <ImageTileModal isOpen={isImageModalOpen} setIsOpen={setImageModalOpen} onTileCreate={addTile} />
    </>
  );
}
