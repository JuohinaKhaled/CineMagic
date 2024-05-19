import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
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
    return this.http.post<any>('/login', { email, password }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.isLoggedIn = true;
          this.kundenID = response.data.KundenID;
          this.name = response.data.Name;
          this.email = response.data.Email;
          this.telefonnummer = response.data.Telefonnummer;
          this.passwort = response.data.Passwort;
          console.log('Login erfolgreich, Name: ', this.name);
          const redirect = this.redirectUrl ? this.router.parseUrl(this.redirectUrl) : '/home';
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
    this.email = '';
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
