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
    // Main container to center the content with a dark background
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-nunito p-4">
      {/* The main card with a glassmorphism effect, rounded corners, and shadow */}
      <div className="w-full max-w-md glass-outer rounded-xl shadow-lg p-8 text-center">
        
        <h1 className="text-2xl font-bold mb-2">
          Auto Generated Message
        </h1>
        <p className="text-red-400 mb-6">
          This service is offline due to a server overload and lack of maintenance(developer so gaya).
        </p>

        {/* Statistics list, visually separated */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <ul className="space-y-3 text-left">
            <li className="flex justify-between items-center text-gray-300">
              <span>Peak Daily Users</span>
              <span className="font-semibold text-lg text-white">83</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span>Recurring Users</span>
              <span className="font-semibold text-lg text-white">12</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span>Total Uptime</span>
              <span className="font-semibold text-lg text-white">79h 15m</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span>Successful Projects Graveyard</span>
              <span className="font-semibold text-lg text-white">11</span>
            </li>
          </ul>
        </div>
        
        {/* Closing remarks and signature */}
        <p className="mt-8 text-gray-200">
          Thank you for using and caring about this project.
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Good Night. GG.
        </p>
        <p className="mt-6 text-xl italic text-gray-100">
          ~ Izhaan 🤍
        </p>
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
