import { Suspense } from "react"
import Link from "next/link"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { STORE_NAME } from "@/lib/constants"
import { T, Tplural } from "@/components/t"
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

  return (
    <div className="space-y-8">
      {!hasActiveFilter && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border px-6 py-10 sm:py-14 sm:px-10">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <T k="hero.welcome" vars={{ store: STORE_NAME }} />
            </h1>
            <p className="mt-2 text-muted-foreground max-w-lg text-sm sm:text-base leading-relaxed">
              <T k="hero.desc" />
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#products">
                <Button size="lg" className="rounded-full text-sm px-6">
                  <T k="hero.shop_now" />
                </Button>
              </Link>
              <Link href="#categories">
                <Button variant="outline" size="lg" className="rounded-full text-sm px-6">
                  <T k="hero.browse_categories" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
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
