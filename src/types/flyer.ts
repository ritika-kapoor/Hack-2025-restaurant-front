export interface Product {
  name: string;
  category: string;
}

export interface FlyerItem {
  product: Product;
  price_excluding_tax: number;
  price_including_tax: number;
  unit: string;
  restriction_note: string;
}

export interface Campaign {
  name: string;
  start_date: string;
  end_date: string;
}

export interface Store {
  name: string;
  prefecture: string;
  city: string;
  street: string;
}

export interface FlyerData {
  store: Store;
  campaign: Campaign;
  flyer_items: FlyerItem[];
  display_expiry_date?: string; // ISO 8601 date string (optional)
}

export interface FlyerResponse {
  id: string;
  store_id: string;
  image_data: string; // base64 encoded image
  flyer_data: FlyerData;
  display_expiry_date?: string; // ISO 8601 date string (optional)
  created_at: string;
}

// チラシ作成・編集フォーム用の型
export interface FlyerFormData {
  image: File | null;
  display_expiry_date?: string; // フォーム入力用 (YYYY-MM-DD or ISO string)
}

// API リクエスト用の型
export interface CreateFlyerRequest {
  flyer_data?: Partial<FlyerData>;
  display_expiry_date?: string;
}
