'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Tile } from '@/lib/types';

type ImageTileModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTileCreate: (tile: Omit<Tile, 'id' | 'entry_id'>) => void;
};

export function ImageTileModal({ isOpen, setIsOpen, onTileCreate }: ImageTileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      onTileCreate({ type: 'image', content: data.url, order: 0 }); // Order set by parent
      setIsOpen(false);
      setFile(null);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-800 text-emerald-600 border-green-600">
        <DialogHeader>
          <DialogTitle>Add Image Tile</DialogTitle>
        </DialogHeader>
        <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Choose File</Button>
            {file && <p className="mt-2 text-sm text-gray-400">{file.name}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={isLoading || !file}>{isLoading ? 'Uploading...' : 'Add Tile'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
