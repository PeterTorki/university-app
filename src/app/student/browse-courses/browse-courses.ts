import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { CourseService } from '../../services/course';
import { AuthService } from '../../services/auth';
import { Course } from '../../interfaces/course';

@Component({
  selector: 'app-browse-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './browse-courses.html',
  styleUrl: './browse-courses.css',
})
export class BrowseCoursesComponent implements OnInit {
  allCourses: Course[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  currentUserId: string = '';
  myEnrolledIds: string[] = [];

  constructor(private courseService: CourseService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.currentUserId = user?._id || '';
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.allCourses = response.AllCourses || [];
        this.checkEnrolledCourses();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      },
    });
  }

  /**
   * التحقق من الكورسات المسجل فيها الطالب
   */
  checkEnrolledCourses(): void {
    this.myEnrolledIds = [];
    this.allCourses.forEach((course) => {
      const studentIds = (course.students || []).map((s: any) =>
        typeof s === 'string' ? s : s._id
      );
      if (studentIds.includes(this.currentUserId)) {
        this.myEnrolledIds.push(course._id);
      }
    });
  }

  /**
   * التسجيل في كورس
   */
  enrollCourse(course: Course): void {
    if (!confirm(`Enroll in "${course.title}"?`)) return;

    const currentStudents = (course.students || []).map((s: any) =>
      typeof s === 'string' ? s : s._id
    );

    if (!currentStudents.includes(this.currentUserId)) {
      currentStudents.push(this.currentUserId);
    }

    this.courseService.updateCourseStudents(course._id, currentStudents).subscribe({
      next: () => {
        alert('Successfully enrolled!');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error enrolling:', error);
        alert('Failed to enroll');
      },
    });
  }

  /**
   * إلغاء التسجيل
   */
  unenrollCourse(course: Course): void {
    if (!confirm(`Unenroll from "${course.title}"?`)) return;

    const currentStudents = (course.students || []).map((s: any) =>
      typeof s === 'string' ? s : s._id
    );

    const updatedStudents = currentStudents.filter((id) => id !== this.currentUserId);

    console.log('updatedStudents: ', updatedStudents);

    this.courseService.updateCourseStudents(course._id, updatedStudents).subscribe({
      next: () => {
        alert('Successfully unenrolled!');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error unenrolling:', error);
        alert('Failed to unenroll');
      },
    });
  }

  isEnrolled(courseId: string): boolean {
    return this.myEnrolledIds.includes(courseId);
  }

  get filteredCourses(): Course[] {
    if (!this.searchTerm) return this.allCourses;

    return this.allCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getStudentsCount(course: Course): number {
    return course.students?.length || 0;
  }

  getDepartmentName(dept: any): string {
    return typeof dept === 'object' ? dept.name : 'N/A';
  }
}
