import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from "../../models/user/user";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private changeUserData = '/api/user';
  private fetchUser = '/api/user';

  constructor(private http: HttpClient) {
  }

  updateUserData(data: any): Observable<any> {
    return this.http.put<any>(`${this.changeUserData}/update`, data, this.httpOptions);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${this.changeUserData}/change-password`, data, this.httpOptions);
  }

  fetchUserData(customerID: number): Observable<User> {
    return this.http.post<User>(this.fetchUser, {customerID}, this.httpOptions).pipe(
      tap(user => {
        console.log('User_Service: User fetched successful: ', user);
      }),
      catchError(err => {
        console.log('User_Service: Error fetching User: ', err);
        return throwError(err);
      })
    );
  }
}
