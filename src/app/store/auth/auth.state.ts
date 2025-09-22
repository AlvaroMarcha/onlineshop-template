import { User } from '../../type/types';

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};
