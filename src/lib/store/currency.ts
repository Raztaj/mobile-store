import { create } from "zustand"
import { persist } from "zustand/middleware"

type Currency = "USD" | "SDG"

interface CurrencyState {
  currency: Currency
  setCurrency: (c: Currency) => void
  toggle: () => void
}

export const useCurrencyPref = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
      toggle: () => set({ currency: get().currency === "USD" ? "SDG" : "USD" }),
    }),
    { name: "mobile-store-currency" }
  )
)
