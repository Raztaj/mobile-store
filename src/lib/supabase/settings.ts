import { createAdminClient } from "./admin"

export async function updateStoreSettings(settings: Record<string, string>) {
  const supabase = createAdminClient()

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("store_settings")
      .upsert({ key, value }, { onConflict: "key" })

    if (error) throw new Error(error.message)
  }
}

export async function getStoreSettings() {
  const supabase = createAdminClient()
  const { data } = await supabase.from("store_settings").select("key, value")

  if (!data) return {}

  const settings: Record<string, string> = {}
  for (const row of data) {
    settings[row.key] = row.value
  }
  return settings
}
