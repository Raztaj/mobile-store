"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/store/cart"
import { generateWhatsAppMessage } from "@/lib/constants"

export function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart()
  const [phone, setPhone] = useState("+249123456789")

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => { if (s.phone) setPhone(s.phone) })
      .catch(() => {})
  }, [])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">Your cart is empty</p>
        <Link href="/" className="mt-2 text-sm text-primary underline-offset-4 hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const message = generateWhatsAppMessage(items, subtotal)
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear All
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-lg border p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div className="flex justify-between gap-2">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-sm font-semibold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex justify-between text-base">
          <span>Subtotal</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full" size="lg">
            Order via WhatsApp
          </Button>
        </a>

        <p className="text-xs text-muted-foreground text-center">
          You will be redirected to WhatsApp to complete your order
        </p>
      </div>
    </div>
  )
}
