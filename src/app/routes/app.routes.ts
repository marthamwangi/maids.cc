import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('../app.component').then((c) => c.AppComponent),
  },
  {
    path: ':id',
    pathMatch: 'full',
    loadComponent: () =>
      import('../components/user-details/user-details.component').then(
        (c) => c.UserDetailsComponent
      ),
  },
];
