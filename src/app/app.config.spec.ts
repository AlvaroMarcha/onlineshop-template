import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should have providers array', () => {
    expect(Array.isArray(appConfig.providers)).toBeTrue();
  });
});
