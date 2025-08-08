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
