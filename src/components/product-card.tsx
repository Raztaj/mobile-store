"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/store/cart"
import { toast } from "@/components/ui/toaster"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem)

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
    toast(`${product.name} added to cart`)
  }

  const outOfStock = product.stock_quantity <= 0

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {outOfStock && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              Out of Stock
            </Badge>
          )}
          {product.categories && (
            <Badge variant="secondary" className="absolute right-2 top-2">
              {product.categories.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="line-clamp-1 font-medium text-sm">{product.name}</h3>
          {product.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
              {product.description}
            </p>
          )}
          <p className="font-semibold text-sm mt-1">
            {formatPrice(Number(product.price))}
          </p>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button
            size="sm"
            className="w-full"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-1 h-3.5 w-3.5" />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
