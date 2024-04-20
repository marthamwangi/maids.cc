import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  template: `
    <nav-bar></nav-bar>
    <router-outlet> </router-outlet>
  `,
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
})
export class AppComponent {
  title = 'assignment';
}
