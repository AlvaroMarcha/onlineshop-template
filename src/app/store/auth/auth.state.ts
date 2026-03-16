import { User } from '../../type/types';

export interface AuthState {
  token: string | null;  // JWT access token (60 min)
  refreshToken: string | null;  // UUID refresh token (30 días)
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  loading: false,
  error: null,
};
