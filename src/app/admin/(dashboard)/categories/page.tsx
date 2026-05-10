import { createServerDataClient } from "@/lib/supabase/server-data"
import { AdminCategoryManager } from "./category-manager"
import { T } from "@/components/t"
import type { Category } from "@/types"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const supabase = createServerDataClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold"><T k="admin.categories" /></h1>
      <AdminCategoryManager categories={(categories || []) as Category[]} />
    </div>
  )
}
