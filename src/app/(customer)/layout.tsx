import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import { SdgRateProvider } from "@/components/sdg-rate-provider"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SdgRateProvider>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </SdgRateProvider>
  )
}
