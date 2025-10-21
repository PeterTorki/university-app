import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { CourseService } from '../../services/course';
import { AuthService } from '../../services/auth';
import { Course } from '../../interfaces/course';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
})
export class MyCoursesComponent implements OnInit {
  allCourses: Course[] = [];
  myCourses: Course[] = [];
  isLoading: boolean = true;

  constructor(private courseService: CourseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.allCourses = response.AllCourses || [];
        this.filterMyCourses();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      },
    });
  }

  filterMyCourses(): void {
    const user = this.authService.currentUser();
    const enrolledCoursesIds = user?.enrolledCourses || [];

    this.myCourses = this.allCourses.filter((course) => enrolledCoursesIds.includes(course._id));
  }
}
