import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, sdgRate?: number): string {
  const rate = sdgRate || 600
  return `${(price * rate).toLocaleString()} SDG`
}
