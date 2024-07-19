import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from "../../models/user/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private loginUrl = '/api/login';
  private registerUrl = '/api/register';

  isLoggedIn = false;
  currentUser = new BehaviorSubject<User | null>(null);
  redirectUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, {email, password}, this.httpOptions).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.isLoggedIn = true;
          this.currentUser.next(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          console.log('Auth_Service: Login successful: ', this.currentUser);
          const redirect = this.redirectUrl ? this.redirectUrl : '/';
          this.router.navigate([redirect]);
        } else {
          console.log('Auth_Service: Error during Login: ', response);
        }
      }),
      catchError(err => {
        console.error('Auth_Service: Error during Login: ', err);
        return throwError(err);
      })
    );
  }

  setRedirectUrl(redirectUrl: string) {
    this.redirectUrl = redirectUrl;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser.next(null);
    localStorage.removeItem('userData');
    this.redirectUrl = null;
    this.router.navigate(['/login']);
    console.log('Auth_Service: Logout successful: ');
  }

  registerCustomer(registerData: any): Observable<any> {
    return this.http.post(this.registerUrl, registerData, this.httpOptions).pipe(
      tap(registerData => {
        console.log('Auth_Service: Register User successful: ', registerData);
      }),
      catchError(err => {
        console.error('Auth_Service: Error during Registration:', err);
        return throwError(err);
      })
    );
  }

  getCurrentUser(): User | null {
    const user = this.currentUser.getValue();
    console.log('Auth_Service: Current User fetched successful:', user);
    return user;
  }

  loadUserFromLocalStorage() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user: User = JSON.parse(userData);
      this.currentUser.next(user);
      this.isLoggedIn = true;
      console.log('Auth_Service: Current User fetched from local Storage', user);
    }
  }

}
