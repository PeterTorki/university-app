import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }
}
