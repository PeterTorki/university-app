import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const homeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.currentUser();

    if (user?.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else if (user?.role === 'student') {
      router.navigate(['/student/dashboard']);
    } else {
      router.navigate(['/auth/login']);
    }

    return false;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
