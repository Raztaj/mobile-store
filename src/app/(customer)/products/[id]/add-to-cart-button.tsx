"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/cart"
import { toast } from "@/components/ui/toaster"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem)

  return (
    <Button
      size="lg"
      disabled={disabled}
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url,
          quantity: 1,
        })
        toast(`${product.name} added to cart`)
      }}
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
