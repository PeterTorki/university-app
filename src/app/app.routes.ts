import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';
import { homeGuard } from './guards/home-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [homeGuard],
    children: [],
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth/signup/signup').then((m) => m.SignupComponent),
      },
      {
        path: 'verify/:token',
        loadComponent: () =>
          import('./auth/verify-email/verify-email').then((m) => m.VerifyEmailComponent),
      },
    ],
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/users/users').then((m) => m.UsersComponent),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./admin/departments/departments').then((m) => m.DepartmentsComponent),
      },
      {
        path: 'courses',
        loadComponent: () => import('./admin/courses/courses').then((m) => m.CoursesComponent),
      },
    ],
  },

  {
    path: 'student',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./student/dashboard/dashboard').then((m) => m.StudentDashboardComponent),
      },
      {
        path: 'my-courses',
        loadComponent: () =>
          import('./student/my-courses/my-courses').then((m) => m.MyCoursesComponent),
      },
      {
        path: 'browse-courses',
        loadComponent: () =>
          import('./student/browse-courses/browse-courses').then((m) => m.BrowseCoursesComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
