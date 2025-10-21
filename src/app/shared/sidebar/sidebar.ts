import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MenuItem } from '../../interfaces/menuItem';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      icon: '📊',
      label: 'Dashboard',
      route: '/admin/dashboard',
      roles: ['admin'],
    },
    {
      icon: '👥',
      label: 'Users',
      route: '/admin/users',
      roles: ['admin'],
    },
    {
      icon: '🏢',
      label: 'Departments',
      route: '/admin/departments',
      roles: ['admin'],
    },
    {
      icon: '📚',
      label: 'Courses',
      route: '/admin/courses',
      roles: ['admin'],
    },
    {
      icon: '📊',
      label: 'Dashboard',
      route: '/student/dashboard',
      roles: ['student'],
    },
    {
      icon: '📖',
      label: 'My Courses',
      route: '/student/my-courses',
      roles: ['student'],
    },
    {
      icon: '🔍',
      label: 'Browse Courses',
      route: '/student/browse-courses',
      roles: ['student'],
    },
  ];

  constructor(public authService: AuthService) {}

  get filteredMenuItems(): MenuItem[] {
    const user = this.authService.currentUser();
    if (!user) return [];

    return this.menuItems.filter((item) => !item.roles || item.roles.includes(user.role));
  }
}
