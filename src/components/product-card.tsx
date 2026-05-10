"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/store/cart"
import { useTranslation } from "@/lib/i18n"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem)
  const openCart = useCart((s) => s.openCart)
  const { t } = useTranslation()
  const outOfStock = product.stock_quantity <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity: 1,
    })
    openCart()
  }

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              {t("product.no_image")}
            </div>
          )}
          {outOfStock && (
            <Badge variant="destructive" className="absolute left-2 top-2 rtl:right-2">
              {t("product.out_of_stock")}
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>
      </Link>

      <div className="mt-3 space-y-1.5">
        {product.categories && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.categories.name}
          </p>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="font-bold text-base">
          {formatPrice(Number(product.price))}
        </p>
      </div>

      <Button
        size="sm"
        className="mt-3 w-full rounded-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        disabled={outOfStock}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="me-1.5 h-3.5 w-3.5" />
        {outOfStock ? t("product.out_of_stock") : t("product.add_to_cart")}
      </Button>
    </div>
  )
}
