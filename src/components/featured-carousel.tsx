"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import type { Product } from "@/types"

interface FeaturedCarouselProps {
  products: Product[]
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (products.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t("hero.featured")}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")} className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 snap-x snap-mandatory">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group min-w-[200px] max-w-[200px] shrink-0 snap-start"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  sizes="200px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  {t("product.no_image")}
                </div>
              )}
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                {product.categories?.name}
              </p>
              <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="font-bold text-sm">
                {formatPrice(Number(product.price))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
