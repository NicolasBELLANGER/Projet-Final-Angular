import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService._currentUser();

  if (user?.role !== 'admin') {
    router.navigate(['/catalog']);
    return false;
  }
  return true;
};
