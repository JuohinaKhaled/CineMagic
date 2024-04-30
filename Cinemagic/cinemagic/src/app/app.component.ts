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

  constructor(private router: Router) {
    // Ausblenden von Header und Footer auf der Login-Seite
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderAndFooter = !event.url.includes('/login');
      }
    });
  }
}
