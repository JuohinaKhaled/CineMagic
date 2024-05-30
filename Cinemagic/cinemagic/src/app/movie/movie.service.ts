import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:4200/filme';

  constructor(private http: HttpClient) { }

  getFilms(): Observable<any[]> {
    console.log("Fetching films from API...");
    return this.http.get<any[]>(this.apiUrl);
  }
}
