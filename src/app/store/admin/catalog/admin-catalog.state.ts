import { CategoryAdmin } from '../../../type/admin-types';

export interface AdminCatalogState {
  categories: CategoryAdmin[];
  loading: boolean;
  saving: boolean;
  toggling: boolean;
  error: string | null;
}

export const initialAdminCatalogState: AdminCatalogState = {
  categories: [],
  loading:  false,
  saving:   false,
  toggling: false,
  error:    null,
};
