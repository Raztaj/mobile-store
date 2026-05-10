"use client"

import Link from "next/link"
import { ShoppingCart, Store, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/store/cart"
import { STORE_NAME } from "@/lib/constants"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const itemCount = useCart((s) => s.getItemCount())
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Store className="h-5 w-5" />
          <span className="hidden sm:inline">{STORE_NAME}</span>
        </Link>

        <div className="flex-1" />

        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <Input
              autoFocus
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
            <Button type="submit" size="sm" variant="ghost">
              Search
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSearchOpen(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}

        <Link href="/cart" className="relative">
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
