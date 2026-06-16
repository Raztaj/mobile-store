"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toaster"
import { useTranslation } from "@/lib/i18n"
import { notifySettingsChanged } from "@/lib/use-settings"

interface SettingsFormProps {
  settings: Record<string, string>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const { t } = useTranslation()
  const [phone, setPhone] = useState(settings.store_phone || "")
  const [name, setName] = useState(settings.store_name || "")
  const [currency, setCurrency] = useState(settings.store_currency || "USD")
  const [sdgRate, setSdgRate] = useState(settings.store_sdg_rate || "")
  const [heroTitleAr, setHeroTitleAr] = useState(settings.hero_title_ar || "")
  const [heroTitleEn, setHeroTitleEn] = useState(settings.hero_title_en || "")
  const [heroDescAr, setHeroDescAr] = useState(settings.hero_desc_ar || "")
  const [heroDescEn, setHeroDescEn] = useState(settings.hero_desc_en || "")
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_phone: phone,
          store_name: name,
          store_currency: currency,
          store_sdg_rate: sdgRate,
          hero_title_ar: heroTitleAr,
          hero_title_en: heroTitleEn,
          hero_desc_ar: heroDescAr,
          hero_desc_en: heroDescEn,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")
      notifySettingsChanged()
      toast(t("admin.settings_saved"))
      router.refresh()
    } catch {
      toast(t("admin.settings_failed"), "destructive")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">{t("admin.settings_title")}</h2>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("admin.phone")}</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+249123456789"
            required
          />
          <p className="text-xs text-muted-foreground">{t("admin.phone_hint")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">{t("admin.store_name")}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sudanese Mobile Store"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t("admin.currency")}</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sdg_rate">SDG Rate (1 USD = ? SDG)</Label>
          <Input
            id="sdg_rate"
            value={sdgRate}
            onChange={(e) => setSdgRate(e.target.value)}
            placeholder="600"
            type="number"
          />
          <p className="text-xs text-muted-foreground">Leave empty to hide SDG prices</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">{t("hero.welcome")}</h2>

        <div className="space-y-2">
          <Label htmlFor="hero_title_ar">Hero Title (العربية)</Label>
          <Input
            id="hero_title_ar"
            value={heroTitleAr}
            onChange={(e) => setHeroTitleAr(e.target.value)}
            placeholder="مرحباً بكم في {store}"
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_title_en">Hero Title (English)</Label>
          <Input
            id="hero_title_en"
            value={heroTitleEn}
            onChange={(e) => setHeroTitleEn(e.target.value)}
            placeholder="Welcome to {store}"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_desc_ar">Hero Description (العربية)</Label>
          <Textarea
            id="hero_desc_ar"
            value={heroDescAr}
            onChange={(e) => setHeroDescAr(e.target.value)}
            placeholder="تصفح أحدث الهواتف المحمولة..."
            rows={3}
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_desc_en">Hero Description (English)</Label>
          <Textarea
            id="hero_desc_en"
            value={heroDescEn}
            onChange={(e) => setHeroDescEn(e.target.value)}
            placeholder="Browse the latest mobile phones..."
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? t("admin.saving") : t("common.save")}
      </Button>
    </form>
  )
}
