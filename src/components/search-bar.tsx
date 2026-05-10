"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("search") as HTMLInputElement
    if (input.value.trim()) {
      router.push(`/?search=${encodeURIComponent(input.value.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="search"
        placeholder="Search products..."
        className="h-10 pl-9 rounded-full bg-muted/50 border-none"
      />
    </form>
  )
}
