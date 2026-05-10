"use client"

import { useEffect } from "react"
import { useLang } from "@/lib/i18n"

export function HtmlLang() {
  const lang = useLang((s) => s.lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }, [lang])

  return null
}
