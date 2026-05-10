"use client"

import Link from "next/link"
import { ShoppingCart, Search, Store } from "lucide-react"
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
  const openCart = useCart((s) => s.openCart)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline font-bold text-lg tracking-tight">
            {STORE_NAME}
          </span>
        </Link>

        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 rounded-full bg-muted/50 border-none"
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSearchOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <div className="hidden sm:block flex-1 max-w-md mx-auto">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-9 rounded-full bg-muted/50 border-none"
                  />
                </div>
              </form>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="sm:hidden rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={openCart}
          aria-label="Cart"
          className="relative rounded-full"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
