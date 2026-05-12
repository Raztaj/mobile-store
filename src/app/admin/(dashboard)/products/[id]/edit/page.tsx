import { notFound } from "next/navigation"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { ProductForm } from "@/components/admin/product-form"
import { T } from "@/components/t"
import type { Product, Category } from "@/types"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let product: Product | null = null
  let categories: Category[] = []
  try {
    const supabase = createServerDataClient()
    const [{ data: prod }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, categories(*)").eq("id", id).single(),
      supabase.from("categories").select("*").order("name"),
    ])
    if (prod) product = prod as Product
    if (cats) categories = cats as Category[]
  } catch {
    // DB unavailable
  }

  if (!product) notFound()

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold"><T k="admin.edit_product" /></h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
