import { createServerDataClient } from "@/lib/supabase/server-data"
import { SettingsForm } from "@/components/admin/settings-form"
import { T } from "@/components/t"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const settings: Record<string, string> = {}
  try {
    const supabase = createServerDataClient()
    const { data } = await supabase.from("store_settings").select("key, value")
    if (data) for (const row of data) settings[row.key] = row.value
  } catch {
    // DB unavailable
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold"><T k="admin.settings_title" /></h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
