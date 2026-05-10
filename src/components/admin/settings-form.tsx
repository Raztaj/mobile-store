"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toaster"

interface SettingsFormProps {
  settings: Record<string, string>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [phone, setPhone] = useState(settings.store_phone || "")
  const [name, setName] = useState(settings.store_name || "")
  const [currency, setCurrency] = useState(settings.store_currency || "USD")
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_phone: phone, store_name: name, store_currency: currency }),
      })

      if (!res.ok) throw new Error("Failed to save")
      toast("Settings saved")
      router.refresh()
    } catch {
      toast("Failed to save settings", "destructive")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="phone">WhatsApp Phone Number</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+249123456789"
          required
        />
        <p className="text-xs text-muted-foreground">
          Full international format, e.g. +249123456789
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Store Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sudanese Mobile Store"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="USD"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}
