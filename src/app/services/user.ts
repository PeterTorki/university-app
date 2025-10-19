import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { AuthService } from './auth';
import { UserResponse } from '../interfaces/userResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<{ message: UserResponse[] }> {
    return this.http.get<{ message: UserResponse[] }>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getUserById(id: string): Observable<{ User: UserResponse }> {
    return this.http.get<{ User: UserResponse }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateUser(id: string, userData: Partial<UserResponse>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
