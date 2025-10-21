import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { DepartmentService } from '../../services/department';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(public authService: AuthService, public departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    if (this.currentUser && this.currentUser.department) {
      this.departmentService
        .getDepartmentById(this.currentUser.department)
        .subscribe((response) => {
          console.log(response);
          this.currentUser.department = response.department;
        });
    }
  }
  get enrolledCoursesCount(): number {
    return this.currentUser?.enrolledCourses?.length || 0;
  }
}
