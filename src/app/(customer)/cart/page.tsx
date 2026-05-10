import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartContent } from "@/components/cart-content"
import { T } from "@/components/t"

export default function CartPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <T k="cart.continue" />
          </Button>
        </Link>
      </div>
      <CartContent />
    </div>
  )
}
