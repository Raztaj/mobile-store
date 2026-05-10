export function formatPriceSDG(usdPrice: number): string {
  return `${(usdPrice * 600).toLocaleString()} SDG`
}

export function formatPriceUSD(price: number): string {
  return `${price.toLocaleString()} ${process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD"}`
}
