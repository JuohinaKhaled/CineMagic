import { Component } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  showHeaderAndFooter: boolean = true;
  title: 'Cinemagic' | undefined;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderAndFooter = !event.url.includes('/login');
      }
    });
  }
}
