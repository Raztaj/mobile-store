import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mobile-store.vercel.app"

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: products } = await supabase.from("products").select("id, created_at")

  const productUrls =
    products?.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...productUrls,
  ]
}
