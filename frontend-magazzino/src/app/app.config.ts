import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register').then((m) => m.RegisterComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
    ]),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
