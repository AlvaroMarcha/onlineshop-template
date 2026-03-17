import { CategoryAdmin } from '../../../type/admin-types';

export interface AdminCatalogState {
  categories: CategoryAdmin[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialAdminCatalogState: AdminCatalogState = {
  categories: [],
  loading: false,
  saving:  false,
  error:   null,
};
