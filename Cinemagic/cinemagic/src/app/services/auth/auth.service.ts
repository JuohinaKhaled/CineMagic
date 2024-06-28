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

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/loginCustomer', { email, password }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.isLoggedIn = true;
          this.kundenID = response.data.KundenID;
          this.name = response.data.Vorname + ' ' + response.data.Nachname;
          this.email = response.data.Email;
          this.telefonnummer = response.data.Telefonnummer;
          this.passwort = response.data.Passwort;
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

  setRedirectUrl(redirectUrl: string) {
    this.redirectUrl = redirectUrl;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.kundenID = null;
    this.name = null;
    this.email = null;
    this.telefonnummer = null;
    this.passwort = null;
    this.redirectUrl = null;
    this.router.navigate(['/login']);
    console.log('Logout');
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

  getCustomerID(): number | null {
    return this.kundenID;
  }

  getCustomerName(): string | null {
    return this.name;
  }

  getCustomerEmail(): string | null {
    return this.email;
  }

  getCustomerPhoneNumber(): string | null {
    return this.telefonnummer;
  }

  getCustomerPassword(): string | null {
    return this.passwort;
  }
}
