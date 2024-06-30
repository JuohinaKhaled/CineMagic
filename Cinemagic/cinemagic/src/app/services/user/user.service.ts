import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:4200/api/customer';

  constructor(private http: HttpClient) {}

  updateUserData(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/change-password`, data);
  }
}
