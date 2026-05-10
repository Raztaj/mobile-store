import { notFound } from "next/navigation"
import Image from "next/image"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { AddToCartButton } from "./add-to-cart-button"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/types"

async function getProduct(id: string) {
  const supabase = createServerDataClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .single()
  return data as Product | null
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const outOfStock = product.stock_quantity <= 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {product.categories && (
                <Badge variant="secondary">{product.categories.name}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold mt-2">{formatPrice(Number(product.price))}</p>
          </div>

          <Separator />

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Stock:</span>
            {outOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <Badge variant="default">{product.stock_quantity} available</Badge>
            )}
          </div>

          <AddToCartButton product={product} disabled={outOfStock} />
        </div>
      </div>
    </div>
  )
}
