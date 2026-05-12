import { createServerDataClient } from "@/lib/supabase/server-data"
import { AdminCategoryManager } from "./category-manager"
import { T } from "@/components/t"
import type { Category } from "@/types"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  let categories: Category[] = []
  try {
    const supabase = createServerDataClient()
    const { data } = await supabase.from("categories").select("*").order("name")
    if (data) categories = data as Category[]
  } catch {
    // DB unavailable
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold"><T k="admin.categories" /></h1>
      <AdminCategoryManager categories={categories} />
    </div>
  )
}
