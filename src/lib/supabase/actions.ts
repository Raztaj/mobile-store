"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAdminClient } from "./admin"
import { createServerSupabaseClient } from "./server"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/admin", "layout")
  return { success: true }
}

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()

  revalidatePath("/admin", "layout")
  redirect("/admin")
}

async function uploadImage(supabase: ReturnType<typeof createAdminClient>, file: File): Promise<string> {
  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, file)
  if (uploadError) throw new Error(uploadError.message)
  const { data: urlData } = supabase.storage
    .from("products")
    .getPublicUrl(fileName)
  return urlData.publicUrl
}

export async function createProduct(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const price = parseFloat(formData.get("price") as string)
  let category_id = formData.get("category_id") as string | null
  if (category_id === "none") category_id = null
  const stock_quantity = parseInt(formData.get("stock_quantity") as string) || 0
  const is_featured = formData.get("is_featured") === "on"
  const colors: string[] = JSON.parse(formData.get("colors") as string || "[]")

  const files = formData.getAll("images") as File[]
  const imageUrls: string[] = []

  for (const f of files) {
    if (f.size > 0) {
      imageUrls.push(await uploadImage(supabase, f))
    }
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      description: description || null,
      price,
      image_url: imageUrls[0] || null,
      category_id,
      stock_quantity,
      is_featured,
      colors,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  if (imageUrls.length > 0) {
    const rows = imageUrls.map((url, i) => ({
      product_id: product.id,
      image_url: url,
      sort_order: i,
    }))
    const { error: imgErr } = await supabase.from("product_images").insert(rows)
    if (imgErr) throw new Error(imgErr.message)
  }

  revalidatePath("/admin/products", "layout")
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const price = parseFloat(formData.get("price") as string)
  let category_id = formData.get("category_id") as string | null
  if (category_id === "none") category_id = null
  const stock_quantity = parseInt(formData.get("stock_quantity") as string) || 0
  const is_featured = formData.get("is_featured") === "on"
  const colors: string[] = JSON.parse(formData.get("colors") as string || "[]")

  const keepIds: string[] = JSON.parse(formData.get("existing_images") as string || "[]")
  const files = formData.getAll("images") as File[]

  const { data: oldImages } = await supabase
    .from("product_images")
    .select("id, image_url")
    .eq("product_id", id)

  const toDelete = (oldImages || []).filter((img) => !keepIds.includes(img.id))
  for (const img of toDelete) {
    const path = img.image_url.split("/").pop()
    if (path) await supabase.storage.from("products").remove([path])
  }
  if (toDelete.length > 0) {
    await supabase.from("product_images").delete().in("id", toDelete.map((i) => i.id))
  }

  const newUrls: string[] = []
  for (const f of files) {
    if (f.size > 0) {
      newUrls.push(await uploadImage(supabase, f))
    }
  }

  if (newUrls.length > 0) {
    const { data: existing } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", id)
      .order("sort_order")
    const maxOrder = existing ? existing.length : keepIds.length
    const rows = newUrls.map((url, i) => ({
      product_id: id,
      image_url: url,
      sort_order: maxOrder + i,
    }))
    const { error: imgErr } = await supabase.from("product_images").insert(rows)
    if (imgErr) throw new Error(imgErr.message)
  }

  const { data: allImages } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id)
    .order("sort_order")

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description: description || null,
      price,
      image_url: allImages?.[0]?.image_url || null,
      category_id,
      stock_quantity,
      is_featured,
      colors,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products", "layout")
  return { success: true }
}

export async function deleteProductImage(imageId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("product_images")
    .select("image_url, product_id")
    .eq("id", imageId)
    .single()
  if (!data) return
  const path = data.image_url.split("/").pop()
  if (path) await supabase.storage.from("products").remove([path])
  await supabase.from("product_images").delete().eq("id", imageId)
  revalidatePath("/admin/products", "layout")
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products", "layout")
}

export async function createCategory(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string

  const { error } = await supabase.from("categories").insert({ name })

  if (error) throw new Error(error.message)

  revalidatePath("/admin/categories", "layout")
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string

  const { error } = await supabase.from("categories").update({ name }).eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/categories", "layout")
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/categories", "layout")
}
