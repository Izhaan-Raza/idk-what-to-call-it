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

  const formattedDate = new Date(entry.entry_date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    // This is now a simple container for the date and the card.
    <div className="space-y-4">
      
      {/* --- UI CHANGE: Date is now outside and above the card --- */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-3xl font-bold text-white">{formattedDate}</h3>
        <Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10 -mr-2" onClick={() => console.log("Menu clicked for entry:", entry.id)}>
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* --- UI CHANGE: Applying the custom 'glass-outer' style --- */}
      <div className="glass-outer">

        {/* The inner container for tiles, with edge-to-edge styling */}
        <div className="glass-inner p-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 row-span-2 rounded-2xl flex items-center justify-center aspect-square overflow-hidden">
              {bigTile ? <TileContent tile={bigTile} /> : <PlaceholderTile />}
            </div>
            {smallTiles.slice(0, 4).map(tile => (
              <div key={tile.id} className="aspect-square rounded-2xl overflow-hidden">
                 <TileContent tile={tile} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer for title and description */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{entry.title}</h2>
          <p className="text-sm text-gray-200">{entry.description}</p>
        </div>
      </div>
    </div>
  )
}

// ... (The TileContent, WorkoutIcon, and PlaceholderTile functions remain unchanged) ...

function WorkoutIcon({ iconType }: { iconType: string }) {
  let iconSrc = '/run.svg';
  if (iconType === 'walk') iconSrc = '/walk.svg';
  if (iconType === 'gym') iconSrc = '/gym.svg';
  return <img src={iconSrc} alt={`${iconType} icon`} className="w-8 h-8" />;
}

function TileContent({ tile }: { tile: Tile }) {
  const API_BASE_URL = 'http://4.240.96.183:5000';

  if (tile.type === 'image') {
    const imageUrl = tile.content.startsWith('/') ? `${API_BASE_URL}${tile.content}` : tile.content;
    return <Image src={imageUrl} alt="Journal tile" width={300} height={300} className="w-full h-full object-cover" unoptimized={true} />;
  }

  if (tile.type === 'workout' || tile.type === 'music') {
    try {
      const data = JSON.parse(tile.content);
      
      if (tile.type === 'workout') {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 gap-1 bg-[#33006679] text-white">
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
            <p className="font-bold">{data.song}</p>
            <p className="text-sm text-gray-400">{data.artist}</p>
          </div>
        );
      }
    } catch (e) {
      console.error("Failed to parse tile content:", e);
      return <PlaceholderTile />;
    }
  }

  return <PlaceholderTile />;
}

function PlaceholderTile() {
  return <div className="w-full h-full aspect-square bg-black/20 rounded-lg" />;
}
