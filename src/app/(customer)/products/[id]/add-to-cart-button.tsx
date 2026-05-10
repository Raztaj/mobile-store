"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/cart"
import { useTranslation } from "@/lib/i18n"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem)
  const openCart = useCart((s) => s.openCart)
  const { t } = useTranslation()

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
        openCart()
      }}
      className="w-full sm:w-auto rounded-xl text-base h-12 px-8 gap-2"
    >
      <ShoppingCart className="h-5 w-5" />
      {disabled ? t("product.out_of_stock") : t("product.add_to_cart")}
    </Button>
  )
}
