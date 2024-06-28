import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUserData(customerID: number): Observable<any> {
    return this.http.get<any>(`/api/customer/${customerID}`);
  }

  updateUserData(data: any): Observable<any> {
    return this.http.put<any>('/api/customer', data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>('/api/customer/change-password', data);
  }
}
