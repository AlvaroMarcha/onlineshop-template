import { User } from '../../type/types';

export interface AuthState {
  user: User | null;
  token: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
};
