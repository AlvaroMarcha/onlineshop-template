import { loginFailure } from './auth.actions';

describe('auth.actions', () => {
  describe('loginFailure', () => {
    it('should create action with string error', () => {
      const action = loginFailure({ error: 'Invalid credentials' });
      expect(action.error).toBe('Invalid credentials');
    });

    it('should have correct type', () => {
      const action = loginFailure({ error: 'Network error' });
      expect(action.type).toBe('[Auth] Login Failure action');
    });
  });
});
