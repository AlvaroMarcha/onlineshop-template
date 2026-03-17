export interface Terms {
  name: string;
  value: boolean;
  label: string;
}

// shop
export interface ProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  inventoryStatus: 'Stock' | 'Bajo Stock' | 'Fuera de Stock' | string;
  category: string;
}

export interface ProductCartItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  price: number;
  imageUrl: string;
}

export interface SizesItems {
  name: string;
  code: string;
}

export interface ProductReviewUser {
  userId: number;
  name: string;
  surname: string;
}

export interface ProductReviewsItem {
  id: number;
  productId: number;
  user: ProductReviewUser;
  rating: number;
  title: string;
  comment: string;
  likes: number;
  dislikes: number;
  active: boolean;
}

export interface ImgItem {
  itemImageSrc: string;
  alt: string;
  thumbnailImageSrc: string;
  title: string;
}

export interface GalleriaImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

export interface ResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

// auth state

/**
 * Enum para tipos de dirección.
 * Backend: AddressesType
 */
export enum AddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING'
}

/**
 * User interface que coincide con UserResponseDTO del backend.
 * Backend: es.marcha.backend.core.user.application.dto.response.UserResponseDTO
 */
export interface User {
  id: number;
  name: string;
  surname: string;  // Añadido: apellido del usuario
  username: string;
  email: string;
  phone: string;
  roleName: string;  // Backend devuelve string ("ROLE_USER"/"ROLE_ADMIN")
  profileImageUrl: string;  // Añadido: URL de imagen de perfil
  createdAt: string;  // ISO date string (LocalDateTime serializado)
  active: boolean;  // Estado activo/inactivo del usuario (campo del backend en minúsculas)
  verified: boolean;  // Verificación de email (campo del backend en minúsculas)
  addresses: Address[];  // Añadido: direcciones del usuario
}

/**
 * Dirección del usuario (coincide con AddressResponseDTO del backend).
 * Backend: es.marcha.backend.core.user.application.dto.response.AddressResponseDTO
 */
export interface Address {
  id?: number;                    // Opcional para creación
  isDefault: boolean;
  type: AddressType;
  addressLine1: string;
  addressLine2?: string;          // Opcional (segundo campo de dirección)
  country: string;
  city: string;
  postalCode: string;
  createdAt?: string;             // ISO date string, opcional (generado por backend)
}

/**
 * Request de registro.
 * Backend: es.marcha.backend.core.auth.application.dto.request.RegisterRequestDTO
 */
export interface RegisterRequest {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  termsAccepted: boolean;
}

/**
 * Response del login/register/refresh.
 * Backend: es.marcha.backend.core.auth.application.dto.response.AuthResponseDTO
 */
export interface LoginTokenResponse {
  user: User;
  token: string;  // JWT access token (validez 60 minutos)
  refreshToken: string;  // UUID refresh token (validez 30 días)
}

//Backoffice

export interface ProductSubcategory {
  id: number;
  name: string;
  slug: string;
  active: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  subcategories: ProductSubcategory[];
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  taxRate: number;
  categories: ProductCategory[];
  rating: number;
  ratingCount: number;
  stock: number;
  lowStockThreshold: number;
  mainImageUrl: string | null;
  images: string[] | null;
  active: boolean;
  featured: boolean;
  digital: boolean;
  slug: string;
  reviews?: ProductReviewsItem[];
}

export interface Order {
  id: number;
  date: string;
  status: string;
}

//Register
export interface PayloadFormRegister {
  nameValue: string;
  surnamesValue: string;
  userValue: string;
  emailValue: string;
  phoneValue: number;
  passwordValue1: string;
  passwordValue2: string;
}

export interface createClientUser {
  client: {
    id: number | null;
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
  };
  user: {
    id: null;
    name: string;
    username: string;
    password: string;
    email: string;
    phone: number; // idem
    status: true;
    locked: false;
    created_at: string; // mejor ISO que toLocaleString() de un number
  };
  role: {
    id: number;
  };
}

export interface modifyClientUser {
  id: number;
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
  email: string;
  phone: number;
  address: string;
  user: {
    id: number;
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    status: boolean;
    email_verified_at: string;
    locked: false;
    last_login_at: string;
    created_at: string;
    role_id: number;
  };
}
