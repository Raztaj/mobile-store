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
    `Total: ${total.toLocaleString()} ${currency || "USD"}`,
    "",
    "Name:",
    "Location:",
  ].join("\n")
}
