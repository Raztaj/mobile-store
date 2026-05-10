import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { AddToCartButton } from "./add-to-cart-button"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { T } from "@/components/t"
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <T k="product.back" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
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
              <T k="product.no_image" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            {product.categories && (
              <Badge variant="secondary" className="mb-2">
                {product.categories.name}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold mt-3 text-primary">
              {formatPrice(Number(product.price))}
            </p>
          </div>

          <Separator />

          {product.description ? (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1"><T k="product.description" /></h3>
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic"><T k="product.no_description" /></p>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground"><T k="product.availability" />:</span>
            {outOfStock ? (
              <Badge variant="destructive"><T k="product.out_of_stock" /></Badge>
            ) : (
              <Badge variant="default" className="bg-green-600"><T k="product.in_stock" vars={{ qty: product.stock_quantity }} /></Badge>
            )}
          </div>

          <div className="pt-2">
            <AddToCartButton product={product} disabled={outOfStock} />
          </div>
        </div>
      </div>
    </div>
  )
}
