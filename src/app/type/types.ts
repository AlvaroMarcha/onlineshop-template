export interface Terms {
  name: string;
  value: boolean;
  label: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  inventoryStatus: 'Stock' | 'Bajo Stock' | 'Fuera de Stock' | string;
  category: string;
}

export interface SizesItems {
  name: string;
  code: string;
}

export interface ProductReviewsItem {
  user: string;
  avatar: string;
  date: Date | string;
  review: string;
  rating: number;
}

export interface ImgItem {
  itemImageSrc: string;
  alt: string;
  thumbnailImageSrc: string;
  title: string;
}

// auth state
export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  status: boolean;
  email_verified_at: Date | null;
  locked: boolean;
  last_login: Date | null;
  created_at: Date;
  role_id: number;
}
