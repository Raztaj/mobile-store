"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/cart"

export function CartButton() {
  const itemCount = useCart((s) => s.getItemCount())

  return (
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
  )
}
