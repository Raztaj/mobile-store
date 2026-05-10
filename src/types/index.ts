export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  stock_quantity: number
  is_featured: boolean
  created_at: string
  categories?: Category | null
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string | null
  quantity: number
}

export interface Admin {
  id: string
  email: string
  role: string
}
