import { notFound } from "next/navigation"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { ProductForm } from "@/components/admin/product-form"
import type { Product, Category } from "@/types"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerDataClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, categories(*)").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
  ])

  if (!product) notFound()

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm
        product={product as Product}
        categories={(categories || []) as Category[]}
      />
    </div>
  )
}
