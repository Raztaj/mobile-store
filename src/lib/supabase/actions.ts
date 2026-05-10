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
  redirect("/admin/dashboard")
}

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()

  revalidatePath("/admin", "layout")
  redirect("/admin")
}

export async function createProduct(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const price = parseFloat(formData.get("price") as string)
  const category_id = formData.get("category_id") as string | null
  const stock_quantity = parseInt(formData.get("stock_quantity") as string) || 0
  const is_featured = formData.get("is_featured") === "on"

  const image = formData.get("image") as File | null
  let image_url: string | null = null

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, image)

    if (uploadError) throw new Error(uploadError.message)

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    image_url = urlData.publicUrl
  }

  const { error } = await supabase.from("products").insert({
    name,
    description: description || null,
    price,
    image_url,
    category_id: category_id || null,
    stock_quantity,
    is_featured,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products", "layout")
  redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const price = parseFloat(formData.get("price") as string)
  const category_id = formData.get("category_id") as string | null
  const stock_quantity = parseInt(formData.get("stock_quantity") as string) || 0
  const is_featured = formData.get("is_featured") === "on"

  const image = formData.get("image") as File | null
  let image_url = formData.get("existing_image_url") as string | null

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, image)

    if (uploadError) throw new Error(uploadError.message)

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    image_url = urlData.publicUrl
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description: description || null,
      price,
      image_url,
      category_id: category_id || null,
      stock_quantity,
      is_featured,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products", "layout")
  redirect("/admin/products")
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
