import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { DepartmentService } from '../../services/department';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/user';
import { Stats } from '../../interfaces/stats';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  stats: Stats = {
    totalUsers: 0,
    totalDepartments: 0,
    totalCourses: 0,
    adminCount: 0,
    studentCount: 0,
  };

  isLoading: boolean = true;

  constructor(
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  /**
   * تحميل الإحصائيات
   */
  loadStats(): void {
    this.isLoading = true;

    Promise.all([
      this.userService.getAllUsers().toPromise(),
      this.departmentService.getAllDepartments().toPromise(),
      this.courseService.getAllCourses().toPromise(),
    ])
      .then(([usersRes, deptsRes, coursesRes]) => {
        // حساب الإحصائيات
        const users = usersRes?.message || [];
        this.stats.totalUsers = users.length;
        this.stats.adminCount = users.filter((u) => u.role === 'admin').length;
        this.stats.studentCount = users.filter((u) => u.role === 'student').length;

        this.stats.totalDepartments = deptsRes?.AllDepartments?.length || 0;
        this.stats.totalCourses = coursesRes?.AllCourses?.length || 0;

        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      });
  }
}
