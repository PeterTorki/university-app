import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailComponent implements OnInit {
  isVerifying: boolean = true;
  isSuccess: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // الحصول على الـ Token من الـ URL
    const token = this.route.snapshot.paramMap.get('token');

    if (token) {
      this.verifyEmail(token);
    } else {
      this.isVerifying = false;
      this.errorMessage = 'Invalid verification link';
    }
  }

  /**
   * التحقق من الإيميل
   */
  verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.isVerifying = false;
        this.isSuccess = true;

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.isVerifying = false;
        this.isSuccess = false;

        if (error.status === 404) {
          this.errorMessage = 'User not found or already verified';
        } else {
          this.errorMessage = error.error?.message || 'Verification failed. Please try again.';
        }
      },
    });
  }
}
