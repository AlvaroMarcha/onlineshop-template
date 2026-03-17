import { ProductAdmin, ProductAttrib, ProductSearchParams } from '../../../type/admin-types';
import { Page } from '../../../type/admin-types';

export interface AdminProductState {
  page: Page<ProductAdmin> | null;
  selected: ProductAdmin | null;
  attribs: ProductAttrib[];
  searchParams: ProductSearchParams;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialAdminProductState: AdminProductState = {
  page: null,
  selected: null,
  attribs: [],
  searchParams: { page: 0, size: 20, includeInactive: true },
  loading: false,
  saving: false,
  error: null,
};
