import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { CourseService } from '../../services/course';
import { DepartmentService } from '../../services/department';
import { UserService } from '../../services/user';
import { Course } from '../../interfaces/course';
import { DepartmentResponse } from '../../interfaces/departmentResponse';
import { User } from '../../interfaces/user';
import { UserResponse } from '../../interfaces/userResponse';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  departments: DepartmentResponse[] = [];
  allUsers: UserResponse[] = [];
  isLoading: boolean = true;

  showModal: boolean = false;
  showStudentsModal: boolean = false;
  isEditMode: boolean = false;

  selectedCourse: Course | null = null;
  formData = {
    title: '',
    description: '',
    department: '',
  };

  selectedStudents: string[] = [];
  availableStudents: UserResponse[] = [];

  searchTerm: string = '';
  filterDepartment: string = 'all';

  constructor(
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadDepartments();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.courses = response.AllCourses || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
        alert('Failed to load courses');
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.AllDepartments || [];
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      },
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedCourse = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(course: Course): void {
    this.isEditMode = true;
    this.selectedCourse = course;
    this.formData = {
      title: course.title,
      description: course.description || '',
      department: typeof course.department === 'object' ? course.department._id : course.department,
    };
    this.showModal = true;
  }

  getStudentsCount(course: Course): number {
    if ((course as any).students && Array.isArray((course as any).students)) {
      return (course as any).students.length;
    }
    return 0;
  }

  openStudentsModal(course: Course): void {
    this.selectedCourse = course;
    this.showStudentsModal = true;

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.allUsers = response.message || [];

        this.selectedStudents = (course.students || []).map((s) =>
          typeof s === 'string' ? s : s._id
        );

        this.availableStudents = this.allUsers.filter(
          (u) => u.role === 'student' && !this.selectedStudents.includes(u._id)
        );
      },
      error: (err) => console.error(err),
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedCourse = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      department: '',
    };
  }

  saveCourse(): void {
    if (!this.formData.title.trim() || !this.formData.department) {
      alert('Course title and department are required');
      return;
    }

    if (this.isEditMode && this.selectedCourse) {
      const payload: Partial<Course> = {
        title: this.formData.title,
        description: this.formData.description,
        department: {
          _id: this.formData.department,
          name: '',
        },
      };

      this.courseService.updateCourse(this.selectedCourse._id, payload).subscribe({
        next: () => {
          alert('Course updated successfully!');
          this.closeModal();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error updating course:', error);
          alert(error.error?.message || 'Failed to update course');
        },
      });
    } else {
      this.courseService.createCourse(this.formData).subscribe({
        next: () => {
          alert('Course created successfully!');
          this.closeModal();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error creating course:', error);
          alert(error.error?.message || 'Failed to create course');
        },
      });
    }
  }

  deleteCourse(course: Course): void {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;

    this.courseService.deleteCourse(course._id).subscribe({
      next: () => {
        alert('Course deleted successfully!');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      },
    });
  }

  get filteredCourses(): Course[] {
    return this.courses.filter((course) => {
      const matchesSearch =
        !this.searchTerm ||
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const deptId =
        typeof course.department === 'object' ? course.department._id : course.department;
      const matchesDepartment = this.filterDepartment === 'all' || deptId === this.filterDepartment;

      return matchesSearch && matchesDepartment;
    });
  }

  getDepartmentName(department: any): string {
    if (typeof department === 'object' && department?.name) {
      return department.name;
    }
    const dept = this.departments.find((d) => d._id === department);
    return dept?.name || 'N/A';
  }
  closeStudentsModal(): void {
    this.showStudentsModal = false;
  }

  getStudentName(studentId: string): string {
    const student = this.allUsers.find((u) => u._id === studentId);
    return student?.name || 'Unknown';
  }

  addStudent(studentId: string): void {
    this.selectedStudents.push(studentId);
    this.availableStudents = this.availableStudents.filter((s) => s._id !== studentId);
  }

  removeStudent(studentId: string): void {
    this.selectedStudents = this.selectedStudents.filter((id) => id !== studentId);
    const student = this.allUsers.find((u) => u._id === studentId);
    if (student) this.availableStudents.push(student);
  }

  saveStudents(): void {
    if (!this.selectedCourse) return;

    this.courseService
      .updateCourseStudents(this.selectedCourse._id, this.selectedStudents)
      .subscribe({
        next: () => {
          alert('Students updated successfully');
          this.closeStudentsModal();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error updating students:', error);
          alert('Failed to update students');
        },
      });
  }
}
