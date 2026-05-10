"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createCategory, deleteCategory } from "@/lib/supabase/actions"
import { toast } from "@/components/ui/toaster"
import type { Category } from "@/types"

interface Props {
  categories: Category[]
}

export function AdminCategoryManager({ categories }: Props) {
  const [name, setName] = useState("")
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setPending(true)
    try {
      const fd = new FormData()
      fd.set("name", name.trim())
      await createCategory(fd)
      setName("")
      toast("Category created")
      router.refresh()
    } catch {
      toast("Failed to create category", "destructive")
    } finally {
      setPending(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
      toast("Category deleted")
      router.refresh()
    } catch {
      toast("Failed to delete category", "destructive")
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-3">
        <Input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit" disabled={pending || !name.trim()}>
          {pending ? "Adding..." : "Add"}
        </Button>
      </form>

      <div className="rounded-lg border">
        {categories.length === 0 ? (
          <p className="p-4 text-center text-muted-foreground text-sm">
            No categories yet
          </p>
        ) : (
          <ul className="divide-y">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
