import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, sdgRate?: number, currency?: string): string {
  const rate = sdgRate || 600
  const cur = currency || "USD"
  const sdg = (price * rate).toLocaleString()
  return `${price.toLocaleString()} ${cur}  (${sdg} SDG)`
}
