import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from './auth.models';
import { AuthStore } from './auth.store';

export function roleGuard(requiredRole: UserRole): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.user()?.role === requiredRole) {
      return true;
    }

    return router.createUrlTree(['/403']);
  };
}
