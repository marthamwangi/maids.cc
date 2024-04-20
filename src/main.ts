import { bootstrapApplication } from '@angular/platform-browser';
import { APP_ROUTES } from './app/routes/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './app/state-manager/state/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { APP_STORE } from './app/state-manager/state/store';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    provideStore(APP_STORE),
    provideEffects([UserEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
}).catch((err) => console.log(err));
