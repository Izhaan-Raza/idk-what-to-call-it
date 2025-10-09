// app/page.tsx

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JournalHeader } from '@/components/journal-header';
import { FloatingActionButton } from '@/components/floating-action-button';
import { JournalEntry } from "@/components/journal-entry";
import { type JournalEntry as JournalEntryType } from "@/lib/types";

// This is the landing page shown to users in a regular browser.
function InstallPrompt() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white font-nunito p-8">
      <div className="text-center max-w-md glass-outer p-8">
        <h1 className="text-4xl font-bold mb-4">LoL too late, Its ded bro 🥀🥀🥀.</h1>
        <p className="text-lg text-gray-300 mb-6">
          Good Night
        </p>
        <div className="text-left space-y-4">
          
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // We now get the 'loading' state from our authentication context.
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);

  useEffect(() => {
    // This ensures our PWA check only runs on the client.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This is our main logic hook. It waits for the client AND for auth to finish loading.
    if (isClient && !loading) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // If the app is installed AND there is no user, redirect to login.
      if (isStandalone && !user) {
        router.push('/login');
      }
    }
  }, [isClient, loading, user, router]);

  useEffect(() => {
    // This effect fetches data only when we have a confirmed user.
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

  // --- Rendering Logic ---

  // While waiting for the client or for authentication to resolve, render nothing.
  // This prevents the blank screen and any content flicker.
  if (!isClient || loading) {
    return null;
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // If not an installed PWA, show the install instructions.
  if (!isStandalone) {
    return <InstallPrompt />;
  }

  // If it IS an installed PWA AND the user is logged in, show the journal.
  if (isStandalone && user) {
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

  // This final 'null' handles the brief moment before the redirect to /login occurs.
  return null;
}
