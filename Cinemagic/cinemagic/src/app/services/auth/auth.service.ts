import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string | null = null;
  kundenID: number | null = null;
  name: string | null = null;
  email: string | null = null;
  telefonnummer: string | null = null;
  passwort: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/loginCustomer', { email, password }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.isLoggedIn = true;
          this.email = response.data.Email;
          console.log('Login erfolgreich, Email: ', this.email);
          const redirect = this.redirectUrl ? this.redirectUrl : '/';
          this.router.navigate([redirect]);
        } else {
          console.log('Login fehlgeschlagen, Antwort: ', response);
        }
      }),
      catchError(err => {
        console.log('Fehler beim Login: ', err);
        return throwError(err);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.email = null;
    this.router.navigate(['/login']);
  }

  registerCustomer(data: any): Observable<any> {
    return this.http.post('/registerCustomer', data).pipe(
      tap(response => {
        console.log('Register response:', response);
      }),
      catchError(err => {
        console.error('Error during registration:', err);
        return throwError(err);
      })
    );
  }
}
