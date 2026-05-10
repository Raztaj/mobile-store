export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Sudanese Mobile Store"
export const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE || "+249123456789"
export const STORE_CURRENCY = process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD"

export function generateWhatsAppMessage(
  items: { name: string; quantity: number; price: number }[],
  total: number,
  currency?: string
): string {
  const lines = items.map(
    (item) => `- ${item.name} x${item.quantity}`
  )

  return [
    "Hello, I want to order:",
    "",
    ...lines,
    "",
    `Total: ${total.toLocaleString()} ${currency || STORE_CURRENCY}`,
    "",
    "Name:",
    "Location:",
  ].join("\n")
}
