"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory, updateCategory } from "@/lib/supabase/actions"
import type { Category } from "@/types"

interface CategoryFormProps {
  category?: Category
  onDone?: () => void
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory

  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      try {
        await action(formData)
        onDone?.()
      } catch (e) {
        return { error: (e as Error).message }
      }
      return null
    },
    null
  )

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex-1 space-y-1">
        <Label htmlFor="name" className="sr-only">
          Category Name
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name}
          required
          placeholder="Category name"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : category ? "Update" : "Add"}
      </Button>
    </form>
  )
}
