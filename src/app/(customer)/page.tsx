import { Suspense } from "react"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import { T, Tplural } from "@/components/t"
import { HeroSection } from "@/components/hero-section"
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
  const hasActiveFilter = !!search || !!category

  const supabase = createServerDataClient()
  const { data: settingsRows } = await supabase.from("store_settings").select("key, value")
  const settings: Record<string, string> = {}
  if (settingsRows) {
    for (const row of settingsRows) {
      settings[row.key] = row.value
    }
  }

  return (
    <div className="space-y-8">
      {!hasActiveFilter && (
        <HeroSection
          customTitleAr={settings.hero_title_ar}
          customTitleEn={settings.hero_title_en}
          customDescAr={settings.hero_desc_ar}
          customDescEn={settings.hero_desc_en}
        />
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 id="products" className="text-xl font-bold">
            {search ? <T k="products.results_for" vars={{ query: search }} /> : <T k="products.title" />}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {products.length} <Tplural k="products.found" count={products.length} />
          </p>
        </div>
        {!hasActiveFilter && (
          <div className="w-full max-w-xs">
            <SearchBar />
          </div>
        )}
      </div>

      <div id="categories">
        <CategoryFilter categories={categories} />
      </div>

      <Suspense>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}
