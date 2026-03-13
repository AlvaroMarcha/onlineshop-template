import { MessageService } from 'primeng/api';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should include MessageService as a global provider', () => {
    const providers = appConfig.providers as unknown[];
    const hasMessageService = providers.some((p) => p === MessageService);
    expect(hasMessageService).toBeTrue();
  });
});
