import type { AppConfig } from '../app/core/config/app-config.token';

export const environment: AppConfig = {
  production: true,
  apiBaseUrl: '/api',
  topupMaxAmount: 10_000_000,
  transferFee: 0,
  featureFlags: {
    history: false,
    notifications: false,
    statement: false,
    admin: false,
    withdraw: false,
  },
};
