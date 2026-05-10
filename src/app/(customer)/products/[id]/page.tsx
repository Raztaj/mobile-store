import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { AddToCartButton } from "./add-to-cart-button"
import { formatPriceUSD, formatPriceSDG } from "@/lib/hooks/format-price"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2 } from "lucide-react"
import { ShareWhatsApp } from "@/components/share-whatsapp"
import { T } from "@/components/t"
import type { Product } from "@/types"

async function getProduct(id: string) {
  const supabase = createServerDataClient()
  const [prodResult, settingsResult] = await Promise.all([
    supabase.from("products").select("*, categories(*)").eq("id", id).single(),
    supabase.from("store_settings").select("key, value"),
  ])
  const product = prodResult.data as Product | null
  const settings: Record<string, string> = {}
  if (settingsResult.data) {
    for (const row of settingsResult.data) {
      settings[row.key] = row.value
    }
  }
  return { product, sdgRate: parseFloat(settings.store_sdg_rate || "0") }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = createServerDataClient()
  const { data } = await supabase.from("products").select("name, description, image_url").eq("id", id).single()

  if (!data) return { title: "Product Not Found" }

  return {
    title: data.name,
    description: data.description || `${data.name} - Sudanese Mobile Store`,
    openGraph: data.image_url ? { images: [data.image_url] } : undefined,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { product, sdgRate } = await getProduct(id)

  if (!product) notFound()

  const outOfStock = product.stock_quantity <= 0
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mobile-store.vercel.app"

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <T k="product.back" />
          </Button>
        </Link>
        <ShareWhatsApp name={product.name} url={`${baseUrl}/products/${product.id}`} />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-3">
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
        </div>

        <div className="flex flex-col gap-5">
          <div>
            {product.categories && (
              <Badge variant="secondary" className="mb-2">
                {product.categories.name}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            <div className="mt-3">
              <p className="text-3xl font-bold text-primary">
                {formatPriceUSD(Number(product.price))}
              </p>
              {sdgRate > 0 && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formatPriceSDG(Number(product.price))}
                </p>
              )}
            </div>
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

          <div className="pt-2 flex items-center gap-3">
            <AddToCartButton product={product} disabled={outOfStock} />
            <Link
              href={`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product.name}\n${baseUrl}/products/${product.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border hover:bg-muted transition-colors"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
