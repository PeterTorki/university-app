import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
  }

  /**
   * عدد الكورسات المسجلة
   */
  get enrolledCoursesCount(): number {
    return this.currentUser?.enrolledCourses?.length || 0;
  }
}
