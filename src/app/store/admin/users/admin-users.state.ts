import { Page, UserAdmin, UserSearchParams } from '../../../type/admin-types';

export interface AdminUsersState {
  users:         Page<UserAdmin> | null;
  selected:      UserAdmin | null;
  searchParams:  UserSearchParams;
  loading:       boolean;
  detailLoading: boolean;
  saving:        boolean;
  error:         string | null;
}

export const initialAdminUsersState: AdminUsersState = {
  users:         null,
  selected:      null,
  searchParams:  { page: 0, size: 20 },
  loading:       false,
  detailLoading: false,
  saving:        false,
  error:         null,
};
