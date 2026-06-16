"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { createProduct, updateProduct, deleteProductImage } from "@/lib/supabase/actions"
import { useTranslation } from "@/lib/i18n"
import { PHONE_COLORS } from "@/lib/phone-colors"
import type { Product, Category, ProductImage } from "@/types"
import { X, Plus, Check } from "lucide-react"

const colorToHex: Record<string, string> = {}
for (const c of PHONE_COLORS) colorToHex[c.name] = c.hex

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [selectedColors, setSelectedColors] = useState<string[]>(product?.colors || [])
  const [existingImgs, setExistingImgs] = useState<ProductImage[]>(product?.images || [])
  const [newFilePreviews, setNewFilePreviews] = useState<{ file: File; url: string }[]>([])

  const toggleColor = (name: string) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setNewFilePreviews((prev) => [...prev, ...previews])
    e.target.value = ""
  }

  const removeNewFile = (index: number) => {
    setNewFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const removeExistingImage = async (img: ProductImage) => {
    try {
      await deleteProductImage(img.id)
      setExistingImgs((prev) => prev.filter((i) => i.id !== img.id))
    } catch {
      // ignore
    }
  }

  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct

  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("colors", JSON.stringify(selectedColors))
      formData.set("existing_images", JSON.stringify(existingImgs.map((i) => i.id)))
      for (const { file } of newFilePreviews) {
        formData.append("images", file)
      }
      try {
        return await action(formData)
      } catch (e) {
        return { error: (e as Error).message }
      }
    },
    null
  )

  useEffect(() => {
    if (state && "success" in state && state.success) {
      router.push("/admin/products")
    }
  }, [state, router])

  useEffect(() => {
    return () => {
      for (const p of newFilePreviews) URL.revokeObjectURL(p.url)
    }
  }, [newFilePreviews])

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("admin.product_name")}</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          required
          placeholder="e.g. iPhone 16 Pro Max"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("product.description")}</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description || ""}
          placeholder="Full product description, specs, and details..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t("admin.price")} (USD)</Label>
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
        <Select name="category_id" defaultValue={product?.category_id || "none"}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No category</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Colors</Label>
        <div className="flex flex-wrap gap-2">
          {PHONE_COLORS.map((c) => {
            const active = selectedColors.includes(c.name)
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleColor(c.name)}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all hover:border-foreground"
                style={{
                  borderColor: active ? c.hex : undefined,
                  backgroundColor: active ? c.hex + "20" : undefined,
                }}
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full border"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
                {active && <Check className="h-3 w-3" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Images</Label>

        {existingImgs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {existingImgs.map((img) => (
              <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-md border">
                <Image src={img.image_url} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {newFilePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newFilePreviews.map((p, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md border">
                <Image src={p.url} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Plus className="h-4 w-4 me-1" />
          Add images
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />
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
