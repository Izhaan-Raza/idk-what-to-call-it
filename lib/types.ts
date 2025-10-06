// lib/types.ts

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Tile {
  id: number;
  type: 'image' | 'workout' | 'music';
  content: string; // URL for image, JSON string for others
  order: number;
}

export interface JournalEntry {
  id: number;
  title: string;
  description: string | null;
  entry_date: string; // ISO date string
  location: string | null;
  tiles: Tile[];
}
