import { getProductFailure } from './products.actions';

describe('products.actions', () => {
  describe('getProductFailure', () => {
    it('should create action with string error', () => {
      const action = getProductFailure({ error: 'Product not found' });
      expect(action.error).toBe('Product not found');
    });

    it('should have correct type', () => {
      const action = getProductFailure({ error: 'Server error' });
      expect(action.type).toBe('[Products] Products Failure action');
    });
  });
});
