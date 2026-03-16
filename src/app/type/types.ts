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
  roleName: string;  // Backend devuelve string ("ADMIN"/"USER"), no number
  profileImageUrl: string;  // Añadido: URL de imagen de perfil
  createdAt: string;  // ISO date string (LocalDateTime serializado)
  isActive: boolean;  // Cambiado de 'status'
  isVerified: boolean;  // Cambiado de 'email_verified_at: Date | null' a boolean
  addresses: Address[];  // Añadido: direcciones del usuario
}

/**
 * Dirección del usuario (entity Address del backend).
 * Backend: es.marcha.backend.core.user.domain.model.Address
 */
export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
export interface Product {
  id: number;
  name: string;
  description: string;
  urlImg: string;
  stock: number;
  price: number;
  bar_code: string;
  reference: string;
  visible: boolean;
  category: string;
  subcategory: string;
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
