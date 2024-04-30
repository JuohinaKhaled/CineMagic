import { Route } from '@angular/router';
import { LoginViewComponent } from './login-view/login-view.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginViewComponent }
];
