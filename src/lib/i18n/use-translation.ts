import { useLang } from "./store"
import { translations } from "./translations"

export function useTranslation() {
  const lang = useLang((s) => s.lang)
  const toggleLang = useLang((s) => s.toggleLang)

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const dict = translations[lang]
    let text = dict[key]
    if (!text) {
      const enFallback = translations["en"][key]
      text = enFallback || key
    }
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  const plural = (key: string, count: number, vars?: Record<string, string | number>): string => {
    const suffix = count === 1 ? "" : "_plural"
    return t(key + suffix, { count, ...vars })
  }

  return { t, plural, lang, toggleLang, isRtl: lang === "ar" }
}
