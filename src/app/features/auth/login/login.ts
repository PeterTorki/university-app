import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth'; // لاحظ الاسم نفس اللي عندك
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('✅ Login success:', res);

        // حسب الـ API بتاعك، الرد بيكون بالشكل ده تقريبًا:
        // { token: '...', user: { ... } }

        if (res.token) {
          localStorage.setItem('token', res.token);
          // تقدر كمان تخزن بيانات المستخدم لو حبيت
          // localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']); // أو dashboard
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Login error:', err);
        this.errorMessage = err?.error?.message || 'Invalid email or password.';
      },
    });
  }
}
