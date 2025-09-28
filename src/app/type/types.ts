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

export interface LoginTokenResponse {
  user: User;
  token: string;
}

//Backoffice
export interface Product {
  id: number;
  name: string;
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
