import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environments';
import { AuthService } from './auth';
import { Course } from '../interfaces/course';


@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCourses(): Observable<{ AllCourses: Course[] }> {
    return this.http.get<{ AllCourses: Course[] }>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getCourseById(id: string): Observable<{ course: Course }> {
    return this.http.get<{ course: Course }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createCourse(courseData: {
    title: string;
    description?: string;
    department: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, courseData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateCourse(id: string, courseData: Partial<Course>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courseData, {
      headers: this.authService.getAuthHeaders(),
    });
  }
  updateCourseStudents(id: string, studentIds: string[]): Observable<any> {
    if (!studentIds) {
      return this.http.put(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
    }
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { students: studentIds },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
