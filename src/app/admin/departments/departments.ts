import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { DepartmentService } from '../../services/department';
import { DepartmentResponse } from '../../interfaces/departmentResponse';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class DepartmentsComponent implements OnInit {
  departments: DepartmentResponse[] = [];
  isLoading: boolean = true;

  // Modal States
  showModal: boolean = false;
  isEditMode: boolean = false;

  // Form Data
  selectedDepartment: DepartmentResponse | null = null;
  formData = {
    name: '',
    description: '',
  };

  // Search
  searchTerm: string = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  /**
   * تحميل جميع الأقسام
   */
  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.AllDepartments || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoading = false;
        alert('Failed to load departments');
      },
    });
  }

  /**
   * فتح Modal للإضافة
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedDepartment = null;
    this.resetForm();
    this.showModal = true;
  }

  /**
   * فتح Modal للتعديل
   */
  openEditModal(department: DepartmentResponse): void {
    this.isEditMode = true;
    this.selectedDepartment = department;
    this.formData = {
      name: department.name,
      description: department.description || '',
    };
    this.showModal = true;
  }

  /**
   * إغلاق Modal
   */
  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedDepartment = null;
    this.resetForm();
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(): void {
    this.formData = {
      name: '',
      description: '',
    };
  }

  /**
   * حفظ القسم (إضافة أو تعديل)
   */
  saveDepartment(): void {
    if (!this.formData.name.trim()) {
      alert('Department name is required');
      return;
    }

    if (this.isEditMode && this.selectedDepartment) {
      // تعديل قسم موجود
      this.departmentService
        .updateDepartment(this.selectedDepartment._id, this.formData)
        .subscribe({
          next: (response) => {
            alert('Department updated successfully!');
            this.closeModal();
            this.loadDepartments();
          },
          error: (error) => {
            console.error('Error updating department:', error);
            alert(error.error?.message || 'Failed to update department');
          },
        });
    } else {
      // إضافة قسم جديد
      this.departmentService.createDepartment(this.formData).subscribe({
        next: (response) => {
          alert('Department created successfully!');
          this.closeModal();
          this.loadDepartments();
        },
        error: (error) => {
          console.error('Error creating department:', error);
          alert(error.error?.message || 'Failed to create department');
        },
      });
    }
  }

  /**
   * حذف قسم
   */
  deleteDepartment(department: DepartmentResponse): void {
    if (!confirm(`Are you sure you want to delete "${department.name}"?`)) return;

    this.departmentService.deleteDepartment(department._id).subscribe({
      next: () => {
        alert('Department deleted successfully!');
        this.loadDepartments();
      },
      error: (error) => {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      },
    });
  }

  /**
   * فلترة الأقسام
   */
  get filteredDepartments(): DepartmentResponse[] {
    if (!this.searchTerm) return this.departments;

    return this.departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
