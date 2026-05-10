import { createServerDataClient } from "@/lib/supabase/server-data"
import { ProductForm } from "@/components/admin/product-form"
import { T } from "@/components/t"
import type { Category } from "@/types"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  let categories: Category[] = []
  try {
    const supabase = createServerDataClient()
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name")
    if (data) categories = data as Category[]
  } catch {
    // DB unavailable — form will work without categories
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold"><T k="admin.add_product" /></h1>
      <ProductForm categories={categories} />
    </div>
  )
}
