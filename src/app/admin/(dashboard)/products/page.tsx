import Link from "next/link"
import Image from "next/image"
import { Plus, Edit } from "lucide-react"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { T } from "@/components/t"
import { DeleteButton } from "./delete-button"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  let products: Product[] = []
  let sdgRate = 600
  try {
    const supabase = createServerDataClient()
    const { data: settings } = await supabase.from("store_settings").select("key, value")
    const settingsMap: Record<string, string> = {}
    if (settings) for (const row of settings) settingsMap[row.key] = row.value
    sdgRate = parseFloat(settingsMap.store_sdg_rate || "600")
    const { data: prods } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false })
    if (prods) products = prods as Product[]
  } catch {
    // DB unavailable
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold"><T k="admin.products" /></h1>
        <Link href="/admin/products/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <T k="admin.add_product" />
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-medium"><T k="admin.product_name" /></th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell"><T k="admin.category" /></th>
                <th className="text-right py-3 px-4 font-medium"><T k="admin.price" /></th>
                <th className="text-right py-3 px-4 font-medium hidden sm:table-cell"><T k="admin.stock" /></th>
                <th className="text-right py-3 px-4 font-medium"><T k="common.edit" /></th>
              </tr>
            </thead>
            <tbody>
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    <T k="admin.no_products" />
                  </td>
                </tr>
              )}
              {products?.map((product: Product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            --
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                    {product.categories?.name || "-"}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {formatPrice(Number(product.price), sdgRate)}
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    {product.stock_quantity <= 0 ? (
                      <Badge variant="destructive"><T k="product.out_of_stock" /></Badge>
                    ) : product.stock_quantity <= 5 ? (
                      <Badge variant="outline">{product.stock_quantity}</Badge>
                    ) : (
                      <span>{product.stock_quantity}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
