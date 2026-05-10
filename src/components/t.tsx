"use client"

import { useTranslation } from "@/lib/i18n"

export function T({ k, vars }: { k: string; vars?: Record<string, string | number> }) {
  const { t } = useTranslation()
  return <>{t(k, vars)}</>
}

export function Tplural({ k, count, vars }: { k: string; count: number; vars?: Record<string, string | number> }) {
  const { plural } = useTranslation()
  return <>{plural(k, count, { count, ...vars })}</>
}
