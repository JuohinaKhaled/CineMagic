import { Route } from '@angular/router';
import { LoginViewComponent } from './login-view/login-view.component';
import { SignUpViewComponent } from './sign-up-view/sign-up-view.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginViewComponent },
  { path: 'signup', component: SignUpViewComponent }
];
