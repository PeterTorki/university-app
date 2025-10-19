import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { AuthService } from './auth';
import { DepartmentResponse } from '../interfaces/departmentResponse';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllDepartments(): Observable<{ AllDepartments: DepartmentResponse[] }> {
    return this.http.get<{ AllDepartments: DepartmentResponse[] }>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getDepartmentById(id: string): Observable<{ department: DepartmentResponse }> {
    return this.http.get<{ department: DepartmentResponse }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createDepartment(departmentData: { name: string; description?: string }): Observable<any> {
    return this.http.post(this.apiUrl, departmentData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateDepartment(id: string, departmentData: Partial<DepartmentResponse>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, departmentData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
