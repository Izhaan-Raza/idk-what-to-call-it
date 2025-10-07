"use client"

import { MoreVertical } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { type JournalEntry as JournalEntryType, type Tile } from "@/lib/types";

interface JournalEntryProps {
  entry: JournalEntryType;
}

export function JournalEntry({ entry }: JournalEntryProps) {
  const sortedTiles = [...entry.tiles].sort((a, b) => a.order - b.order);
  const bigTile = sortedTiles.find(tile => tile.order === 0);
  const smallTiles = sortedTiles.filter(tile => tile.order > 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold text-white">{new Date(entry.entry_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10 -mr-2" onClick={() => console.log("Menu clicked for entry:", entry.id)}>
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="glass-outer">
        <div className="glass-inner p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 row-span-2 rounded-xl flex items-center justify-center aspect-square overflow-hidden">
              {bigTile ? <TileContent tile={bigTile} /> : <PlaceholderTile />}
            </div>
            {smallTiles.slice(0, 4).map(tile => (
              <div key={tile.id} className="aspect-square rounded-lg overflow-hidden">
                 <TileContent tile={tile} />
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{entry.title}</h2>
          <p className="text-sm text-gray-200">{entry.description}</p>
        </div>
      </div>
    </div>
  )
}

function WorkoutIcon({ iconType }: { iconType: string }) {
  let iconSrc = '/run.svg';
  if (iconType === 'walk') iconSrc = '/walk.svg';
  if (iconType === 'gym') iconSrc = '/gym.svg';
  return <img src={iconSrc} alt={`${iconType} icon`} className="w-8 h-8" />;
}

// --- THIS IS THE FINAL AND MOST IMPORTANT CHANGE ---
function TileContent({ tile }: { tile: Tile }) {
  if (tile.type === 'image') {
    const imageUrl = tile.content.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${tile.content}`
      : tile.content;
      
    // We are now using a standard <img> tag. This bypasses Next.js's Image
    // component entirely and gives us more direct control.
    return (
      <img
        src={imageUrl}
        alt="Journal tile"
        // The `crossOrigin` attribute is a hint to the browser for handling CORS.
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
        // We add an onError handler for debugging, just in case.
        onError={(e) => console.error("Image failed to load:", e)}
      />
    );
  }

  // The workout and music tiles remain the same
  if (tile.type === 'workout' || tile.type === 'music') {
    try {
      const data = JSON.parse(tile.content);
      if (tile.type === 'workout') {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 gap-1 bg-transparent text-white">
            <WorkoutIcon iconType={data.icon_type} />
            <div className="text-center leading-tight">
              <p className="font-semibold text-sm whitespace-nowrap">{data.text}</p>
              <p className="text-xs text-gray-300">{data.value}</p>
            </div>
          </div>
        );
      }
      if (tile.type === 'music') {
        if (data.imageUrl) {
          return (
            <div className="w-full h-full relative">
              <Image src={data.imageUrl} alt={`Album art for ${data.song}`} width={200} height={200} className="w-full h-full object-cover" unoptimized={true} />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                 <p className="font-bold text-white text-xs truncate">{data.song}</p>
                 <p className="text-xs text-gray-300 truncate">{data.artist}</p>
              </div>
            </div>
          );
        }
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-white bg-slate-800">
            <p className="font-bold">{data.song}</p><p className="text-sm text-gray-400">{data.artist}</p>
          </div>
        );
      }
    } catch (e) {
      return <PlaceholderTile />;
    }
  }

  return <PlaceholderTile />;
}

function PlaceholderTile() {
  return <div className="w-full h-full aspect-square bg-black/20 rounded-lg" />;
}
