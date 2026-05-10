import { createServerDataClient } from "@/lib/supabase/server-data"
import { Package, ShoppingBag, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { T } from "@/components/t"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const supabase = createServerDataClient()

  const [prodCount, catCount, lowStock] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*")
      .lte("stock_quantity", 5)
      .gt("stock_quantity", 0),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold"><T k="admin.dashboard" /></h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.total_products" /></CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{prodCount.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.categories" /></CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{catCount.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.low_stock" /></CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {lowStock.data?.length ?? 0}
            </p>
            {lowStock.data && lowStock.data.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Products with &le;5 items remaining
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
