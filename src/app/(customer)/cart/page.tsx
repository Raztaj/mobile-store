import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartContent } from "@/components/cart-drawer"

export default function CartPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
      <CartContent />
    </div>
  )
}
