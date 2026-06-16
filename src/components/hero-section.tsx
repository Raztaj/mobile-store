"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

interface HeroSectionProps {
  storeName?: string
  customTitleAr?: string
  customTitleEn?: string
  customDescAr?: string
  customDescEn?: string
}

export function HeroSection({ storeName, customTitleAr, customTitleEn, customDescAr, customDescEn }: HeroSectionProps) {
  const { t, lang } = useTranslation()

  const name = storeName || "Store"
  const title =
    lang === "ar"
      ? customTitleAr || t("hero.welcome", { store: name })
      : customTitleEn || t("hero.welcome", { store: name })

  const description =
    lang === "ar"
      ? customDescAr || t("hero.desc")
      : customDescEn || t("hero.desc")

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border px-6 py-10 sm:py-14 sm:px-10">
      <div className="relative">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground max-w-lg text-sm sm:text-base leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="#products">
            <Button size="lg" className="rounded-full text-sm px-6">
              {t("hero.shop_now")}
            </Button>
          </Link>
          <Link href="#categories">
            <Button variant="outline" size="lg" className="rounded-full text-sm px-6">
              {t("hero.browse_categories")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
