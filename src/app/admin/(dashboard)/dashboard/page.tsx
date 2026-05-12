import { createServerDataClient } from "@/lib/supabase/server-data"
import { Package, ShoppingBag, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { T } from "@/components/t"
import { DashboardPhone } from "@/components/admin/dashboard-phone"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  let prodCount = 0
  let catCount = 0
  let lowStockCount = 0
  const settingsMap: Record<string, string> = {}
  try {
    const sup = createServerDataClient()
    const [pc, cc, ls, s] = await Promise.all([
      sup.from("products").select("*", { count: "exact", head: true }),
      sup.from("categories").select("*", { count: "exact", head: true }),
      sup.from("products").select("*").lte("stock_quantity", 5).gt("stock_quantity", 0),
      sup.from("store_settings").select("key, value"),
    ])
    prodCount = pc.count ?? 0
    catCount = cc.count ?? 0
    lowStockCount = ls.data?.length ?? 0
    if (s.data) for (const row of s.data) settingsMap[row.key] = row.value
  } catch {
    // DB unavailable
  }

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
            <p className="text-3xl font-bold">{prodCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.categories" /></CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{catCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium"><T k="admin.low_stock" /></CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lowStockCount}</p>
            {lowStockCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Products with &le;5 items remaining
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <DashboardPhone phone={settingsMap.store_phone || "+249123456789"} />
    </div>
  )
}
