import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { LoginResponse } from '../interfaces/loginResponse';
import { SignupResponse } from '../interfaces/signupResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    this.isLoading.set(true);
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.saveAuthData(response.token, response.User);
          this.isLoading.set(false);
        })
      );
  }

  signup(userData: any): Observable<SignupResponse> {
    this.isLoading.set(true);

    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, userData).pipe(
      tap(() => {
        this.isLoading.set(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['./auth/login']);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verify/${token}`);
  }

  private saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}
