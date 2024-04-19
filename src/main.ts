import { bootstrapApplication } from '@angular/platform-browser';
import { APP_ROUTES } from './app/routes/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/components/landing/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(APP_ROUTES), provideHttpClient()],
}).catch((err) => console.log(err));
