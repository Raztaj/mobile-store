"use client"

import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCurrencyPref } from "@/lib/store/currency"
export function CurrencyToggle() {
  const { currency, toggle } = useCurrencyPref()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="rounded-full gap-1.5 text-xs font-medium"
    >
      <DollarSign className="h-3.5 w-3.5" />
      {currency}
    </Button>
  )
}
