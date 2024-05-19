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

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/loginKunde', { email, password }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.isLoggedIn = true;
          this.kundenID = response.data.KundenID;
          this.name = response.data.Name;
          this.email = response.data.Email;
          this.telefonnummer = response.data.Telefonnummer;
          console.log('Login successful:', response.data);
          this.router.navigate(['/home']);
        } else {
          console.log('Login failed, response:', response);
        }
      }),
      catchError(err => {
        console.log('Error during login:', err);
        return throwError(err);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.kundenID = null;
    this.name = null;
    this.email = null;
    this.telefonnummer = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
