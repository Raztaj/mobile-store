import { NextResponse } from "next/server"
import { createServerDataClient } from "@/lib/supabase/server-data"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createServerDataClient()
  const { data } = await supabase.from("store_settings").select("key, value")

  const settings: Record<string, string> = {}
  if (data) {
    for (const row of data) {
      settings[row.key] = row.value
    }
  }

  return NextResponse.json({
    phone: settings.store_phone || "+249123456789",
    name: settings.store_name || "Sudanese Mobile Store",
    currency: settings.store_currency || "USD",
    sdgRate: parseFloat(settings.store_sdg_rate || "0"),
  })
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const admin = createAdminClient()

  for (const [key, value] of Object.entries(body)) {
    const { error } = await admin
      .from("store_settings")
      .upsert({ key, value }, { onConflict: "key" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
