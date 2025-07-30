export interface Terms {
  name: string;
  value: boolean;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  inventoryStatus: 'Stock' | 'Bajo Stock' | 'Fuera de Stock';
  category: string;
}
