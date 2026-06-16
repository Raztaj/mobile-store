"use client"

import { useState } from "react"
import Image from "next/image"
import type { ProductImage } from "@/types"

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const current = images[selectedIndex]

  if (images.length === 1) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={images[0].image_url}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          priority
        />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={current.image_url}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelectedIndex(i)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
              i === selectedIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
            }`}
          >
            <Image
              src={img.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
