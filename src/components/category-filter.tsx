"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = searchParams.get("category")

  const select = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set("category", id)
    } else {
      params.delete("category")
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => select(null)}
        className="shrink-0"
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selected === cat.id ? "default" : "outline"}
          size="sm"
          onClick={() => select(cat.id)}
          className="shrink-0"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  )
}
