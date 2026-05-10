"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/store/cart"
import { generateWhatsAppMessage } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"
import { useSdgRate } from "@/components/sdg-rate-provider"

export function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart()
  const { t } = useTranslation()
  const sdgRate = useSdgRate()
  const [phone, setPhone] = useState("+249123456789")

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => { if (s.phone) setPhone(s.phone) })
      .catch(() => {})
  }, [])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">{t("cart.empty")}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t("cart.add_products")}
        </p>
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full mt-4">
            {t("cart.continue")}
          </Button>
        </Link>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const message = generateWhatsAppMessage(items, subtotal)
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t("cart.title")}</h2>
          <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? t("cart.item") : t("cart.items")}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
          {t("cart.clear")}
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-xl border p-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  {t("product.no_image")}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div className="flex justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm font-semibold mt-0.5">
                    {formatPrice(item.price * item.quantity, sdgRate)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center text-sm tabular-nums font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4 pt-2">
        <div className="flex justify-between text-lg">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="font-bold">{formatPrice(subtotal, sdgRate)}</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t("cart.whatsapp")}
          </Button>
        </a>
        <p className="text-xs text-muted-foreground text-center">
          {t("cart.redirect")}
        </p>
      </div>
    </div>
  )
}
