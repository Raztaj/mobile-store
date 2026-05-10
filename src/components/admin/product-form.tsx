"use client"

import { useActionState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/lib/supabase/actions"
import { useTranslation } from "@/lib/i18n"
import type { Product, Category } from "@/types"

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const { t } = useTranslation()
  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct

  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      try {
        await action(formData)
      } catch (e) {
        const err = e as Error & { digest?: string }
        if (err.digest === "NEXT_REDIRECT") throw e
        return { error: err.message }
      }
      return null
    },
    null
  )

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("admin.product_name")}</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          required
          placeholder="e.g. Samsung Galaxy A55"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("product.description")}</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description || ""}
          placeholder="Product description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t("admin.price")} ({process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD"})</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product ? Number(product.price) : ""}
            required
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">{t("admin.stock")}</Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            defaultValue={product?.stock_quantity ?? 0}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">{t("admin.category")}</Label>
        <Select name="category_id" defaultValue={product?.category_id || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No category</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">{t("admin.image")}</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
        />
        {product?.image_url && (
          <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-md border">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        )}
        {product?.image_url && (
          <input type="hidden" name="existing_image_url" value={product.image_url} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_featured"
          name="is_featured"
          type="checkbox"
          defaultChecked={product?.is_featured || false}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="is_featured" className="text-sm font-normal">
          {t("admin.featured")}
        </Label>
      </div>

      {state && "error" in state && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("admin.saving") : product ? t("admin.update") : t("admin.create")}
        </Button>
      </div>
    </form>
  )
}
