CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY IF NOT EXISTS "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

-- Admin-only write access
CREATE POLICY IF NOT EXISTS "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Only admins can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Only admins can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Only admins can update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Only admins can delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
  );

-- Store settings
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT ''
);

INSERT INTO store_settings (key, value) VALUES
  ('store_phone', '+249123456789'),
  ('store_name', 'Sudanese Mobile Store'),
  ('store_currency', 'USD')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can read settings"
  ON store_settings FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Admins can update settings"
  ON store_settings FOR UPDATE
  USING (auth.role() = 'authenticated');
