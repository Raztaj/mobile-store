import { useState, useEffect } from "react"

interface StoreSettings {
  name: string
  phone: string
  currency: string
  sdgRate: number
}

let globalListeners: Array<() => void> = []

export function notifySettingsChanged() {
  localStorage.setItem("settings_ts", Date.now().toString())
  for (const fn of globalListeners) fn()
}

function subscribe(fn: () => void) {
  globalListeners.push(fn)
  return () => {
    globalListeners = globalListeners.filter((f) => f !== fn)
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings>({
    name: "",
    phone: "",
    currency: "USD",
    sdgRate: 0,
  })

  useEffect(() => {
    let cancelled = false

    function load() {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((s) => {
          if (!cancelled) setSettings(s)
        })
        .catch(() => {})
    }

    load()

    const unsub = subscribe(() => {
      load()
    })

    const onStorage = (e: StorageEvent) => {
      if (e.key === "settings_ts") load()
    }
    window.addEventListener("storage", onStorage)

    return () => {
      cancelled = true
      unsub()
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  return settings
}
