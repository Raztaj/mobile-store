"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSettings } from "@/lib/use-settings"

const SdgRateContext = createContext(0)

export function SdgRateProvider({ children }: { children: ReactNode }) {
  const { sdgRate } = useSettings()
  return <SdgRateContext.Provider value={sdgRate}>{children}</SdgRateContext.Provider>
}

export function useSdgRate() {
  return useContext(SdgRateContext)
}
