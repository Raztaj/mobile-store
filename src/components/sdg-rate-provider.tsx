"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const SdgRateContext = createContext(600)

export function SdgRateProvider({ children }: { children: ReactNode }) {
  const [rate, setRate] = useState(600)
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => { if (s.sdgRate) setRate(s.sdgRate) })
      .catch(() => {})
  }, [])
  return <SdgRateContext.Provider value={rate}>{children}</SdgRateContext.Provider>
}

export function useSdgRate() {
  return useContext(SdgRateContext)
}
