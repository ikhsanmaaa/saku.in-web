import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface FeatureFlags {
  readonly history: boolean;
  readonly notifications: boolean;
  readonly statement: boolean;
  readonly admin: boolean;
  readonly withdraw: boolean;
}

export interface AppConfig {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly topupMaxAmount: number;
  readonly transferFee: number;
  readonly featureFlags: FeatureFlags;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => environment,
});
