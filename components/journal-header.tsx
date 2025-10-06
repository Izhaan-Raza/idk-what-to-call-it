"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"; // 1. Import the useAuth hook

export function JournalHeader() {
  const { logout } = useAuth(); // 2. Get the logout function from the context

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Journal</h1>
        {/* 3. Replace the console.log with the actual logout function */}
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={logout}> 
          Logout
        </Button>
      </div>
    </header>
  )
}
