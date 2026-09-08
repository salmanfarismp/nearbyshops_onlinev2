export interface StoreCategory {
  id?: string | number;
  name: string;
}

export interface Place {
  id?: string | number;
  name: string;
  lat?: number;
  lng?: number;
}

export interface StorePermission {
  id?: string | number;
  service_type: string;
  show: boolean;
  phone_number?: string | null;
  url?: string | null;
}

export interface ProductImage {
  id?: string | number;
  img_url: string;
  is_primary?: boolean;
  display_order?: number;
}

export interface ProductCategory {
  id: string | number;
  name: string;
  is_visible?: boolean;
  display_order?: number;
  total_count?: Array<{ count: number }>;
  products?: ProductSummary[];
}

export interface ProductSummary {
  id: string | number;
  slug?: string | null;
  name: string;
  description?: string | null;
  price?: string | number | null;
  is_active?: boolean;
  images?: ProductImage[];
}

export interface RatingScore {
  score: number;
}

export interface StoreEntity {
  id: string | number;
  slug?: string | null;
  name: string;
  description?: string | null;
  profile_url?: string | null;
  banner_url?: string | null;
  address?: string | null;
  location?: string | null;
  open_days?: string[] | number[] | null;
  opening_time?: string | null;
  closing_time?: string | null;
  is_public?: boolean;
  category?: StoreCategory | null;
  place?: Place | null;
  permissions?: StorePermission[];
  categories?: ProductCategory[];
  ratings?: RatingScore[];
}

export interface ProductEntity {
  id: string | number;
  slug?: string | null;
  name: string;
  description?: string | null;
  price?: string | number | null;
  is_active?: boolean;
  category?: { id?: string | number; name: string } | null;
  images?: ProductImage[];
  ratings?: RatingScore[];
  store?: StoreEntity | null;
}
