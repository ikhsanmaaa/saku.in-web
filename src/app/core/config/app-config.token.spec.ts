import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from './app-config.token';

describe('APP_CONFIG', () => {
  it('should provide default environment configuration when injected', () => {
    TestBed.configureTestingModule({});

    const config = TestBed.inject(APP_CONFIG);

    expect(config.apiBaseUrl).toBe('/api');
    expect(config.topupMaxAmount).toBe(10_000_000);
    expect(config.transferFee).toBe(0);
    expect(config.featureFlags).toEqual({
      history: false,
      notifications: false,
      statement: false,
      admin: false,
      withdraw: false,
    });
  });

  it('should allow overriding configuration when provided explicitly', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            production: true,
            apiBaseUrl: 'https://api.saku.in',
            topupMaxAmount: 5_000_000,
            transferFee: 2500,
            featureFlags: {
              history: true,
              notifications: false,
              statement: false,
              admin: false,
              withdraw: false,
            },
          },
        },
      ],
    });

    const config = TestBed.inject(APP_CONFIG);

    expect(config.production).toBe(true);
    expect(config.apiBaseUrl).toBe('https://api.saku.in');
    expect(config.featureFlags.history).toBe(true);
  });
});
