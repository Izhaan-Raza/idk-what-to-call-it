"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"; // 1. Import the useRouter hook

export function FloatingActionButton() {
  const router = useRouter(); // 2. Get the router instance

  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-[#33006679] hover:bg-[#27004e57] shadow-lg backdrop-blur-md"
      // 3. Update the onClick handler to navigate
      onClick={() => router.push('/create')}
    >
      <Plus className="h-8 w-8 text-white" />
    </Button>
  )
}
