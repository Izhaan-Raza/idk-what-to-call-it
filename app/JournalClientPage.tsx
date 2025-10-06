// app/JournalClientPage.tsx

'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { JournalHeader } from '@/components/journal-header';
import { FloatingActionButton } from '@/components/floating-action-button';
import { JournalEntry } from "@/components/journal-entry";
import { type JournalEntry as JournalEntryType } from "@/lib/types";

export function JournalClientPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntryType[]>([]);

  useEffect(() => {
    async function fetchEntries() {
      if (user) {
        try {
          const res = await fetch('/api/entries', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setEntries(data);
          }
        } catch (error) {
          console.error("Failed to fetch entries:", error);
        }
      }
    }
    fetchEntries();
  }, [user]);
  
  // The AuthContext handles redirecting to /login if the user is not present.
  // We only render the page content if the user object exists.
  if (user) {
    return (
      <div className="min-h-screen text-white font-nunito">
        <JournalHeader />
        <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-24">
          <div className="space-y-8">
            {entries.length > 0 ? (
              entries.map(entry => <JournalEntry key={entry.id} entry={entry} />)
            ) : (
              <p className="text-center text-gray-400">No entries yet. Click the '+' to add one!</p>
            )}
          </div>
        </main>
        <FloatingActionButton />
      </div>
    );
  }

  // If there's no user, return null and let AuthContext do its job.
  return null;
}
