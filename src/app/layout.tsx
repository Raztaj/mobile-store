import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { HtmlLang } from "@/components/lang-init"
import { createServerDataClient } from "@/lib/supabase/server-data"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerDataClient()
    const { data } = await supabase.from("store_settings").select("key, value")
    const settings: Record<string, string> = {}
    if (data) for (const row of data) settings[row.key] = row.value
    const name = settings.store_name || "Sudanese Mobile Store"
    return { title: name, description: `Browse and order from ${name}` }
  } catch {
    return { title: "Sudanese Mobile Store", description: "Browse and order mobile phones and accessories" }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <HtmlLang />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
