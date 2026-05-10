import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Lang } from "./translations"

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "ar",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "ar" ? "en" : "ar" }),
    }),
    { name: "mobile-store-lang" }
  )
)
