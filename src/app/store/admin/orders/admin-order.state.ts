import { OrderAdmin, OrderSearchParams, Page } from '../../../type/admin-types';

export interface AdminOrderState {
  orders:        Page<OrderAdmin> | null;
  selected:      OrderAdmin | null;
  searchParams:  OrderSearchParams;
  loading:       boolean;
  detailLoading: boolean;
  saving:        boolean;
  error:         string | null;
}

export const initialAdminOrderState: AdminOrderState = {
  orders:        null,
  selected:      null,
  searchParams:  { page: 0, size: 20 },
  loading:       false,
  detailLoading: false,
  saving:        false,
  error:         null,
};
