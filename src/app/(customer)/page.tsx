import { Suspense } from "react"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import type { Product, Category } from "@/types"

async function getData(search?: string, categoryId?: string) {
  const supabase = createServerDataClient()

  const [catResult, prodResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false }),
  ])

  let products = (prodResult.data || []) as Product[]
  const categories = (catResult.data || []) as Category[]

  if (search) {
    const q = search.toLowerCase()
    products = products.filter((p) => p.name.toLowerCase().includes(q))
  }

  if (categoryId) {
    products = products.filter((p) => p.category_id === categoryId)
  }

  return { products, categories }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const { search, category } = await searchParams
  const { products, categories } = await getData(search, category)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Our Products</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse our collection of mobile phones and accessories
        </p>
      </div>

      <CategoryFilter categories={categories} />

      <Suspense>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}
