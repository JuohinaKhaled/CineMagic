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
    return this.http.post<any>('/loginKunde', { email, password }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.isLoggedIn = true;
          this.email = response.data.Email;
          console.log('Login erfolgreich, Email: ', this.email);
          const redirect = this.redirectUrl ? this.redirectUrl : '/home';
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
    this.router.navigate(['/home']);
  }

  getKundenID(): number | null {
    return this.kundenID;
  }

  getName(): string | null {
    return this.name;
  }

  getEmail(): string | null {
    return this.email;
  }

  getTelefonnummer(): string | null {
    return this.telefonnummer;
  }

  getPasswort(): string | null {
    return this.passwort;
  }
}
