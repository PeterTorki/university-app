import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          if (response.User.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/student/dashboard']);
          }
        }, 1000);
      },
      error: (error) => {
        this.authService.isLoading.set(false);
        if (error.status === 403) {
          this.errorMessage = 'Please verify your email first';
        } else if (error.status === 401) {
          this.errorMessage = 'Wrong email or password';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        }
      },
    });
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get isLoading() {
    return this.authService.isLoading();
  }
}
