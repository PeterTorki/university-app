import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { UserService } from '../../services/user';
import { DepartmentService } from '../../services/department';
import { UserResponse } from '../../interfaces/userResponse';
import { DepartmentResponse } from '../../interfaces/departmentResponse';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  departments: DepartmentResponse[] = [];
  isLoading: boolean = true;

  showModal: boolean = false;
  isEditMode: boolean = false;

  selectedUser: UserResponse | null = null;
  formData = {
    name: '',
    email: '',
    role: 'student',
    department: '',
    password: '',
  };

  searchTerm: string = '';
  filterRole: string = 'all';

  constructor(private userService: UserService, private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.message || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        alert('Failed to load users');
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

  openEditModal(user: UserResponse): void {
    this.isEditMode = true;
    this.selectedUser = user;
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department?._id || '',
      password: '',
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedUser = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      role: 'student',
      department: '',
      password: '',
    };
  }

  saveUser(): void {
    if (!this.selectedUser) return;

    const updateData: any = {
      name: this.formData.name,
      email: this.formData.email,
      role: this.formData.role,
    };

    if (this.formData.department) {
      updateData.department = this.formData.department;
    }

    if (this.formData.password) {
      updateData.password = this.formData.password;
    }

    this.userService.updateUser(this.selectedUser._id, updateData).subscribe({
      next: (response) => {
        alert('User updated successfully!');
        this.closeModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        alert(error.error?.message || 'Failed to update user');
      },
    });
  }

  deleteUser(user: UserResponse): void {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        alert('User deleted successfully!');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      },
    });
  }

  get filteredUsers(): UserResponse[] {
    return this.users.filter((user) => {
      const matchesSearch =
        !this.searchTerm ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.filterRole === 'all' || user.role === this.filterRole;

      return matchesSearch && matchesRole;
    });
  }

  getDepartmentName(departmentId: any): string {
    if (!departmentId) return 'N/A';
    if (typeof departmentId === 'object' && departmentId.name) {
      return departmentId.name;
    }
    const dept = this.departments.find((d) => d._id === departmentId);
    return dept?.name || 'N/A';
  }
}
