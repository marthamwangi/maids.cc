import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../components/landing/landing.component').then(
        (c) => c.LandingPage
      ),
  },
  {
    path: 'view/:id',
    pathMatch: 'full',
    loadComponent: () =>
      import('../components/user-details/user-details.component').then(
        (c) => c.UserDetailsComponent
      ),
  },
];
