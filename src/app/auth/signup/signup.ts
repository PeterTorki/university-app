import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { DepartmentService } from '../../services/department';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  departments: string[] = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private departmentsService: DepartmentService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        role: ['student', [Validators.required]],
        department: [''],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const formData = { ...this.signupForm.value };
    delete formData.confirmPassword;

    if (!formData.department) {
      delete formData.department;
    }

    this.authService.signup(formData).subscribe({
      next: (response) => {
        this.successMessage =
          'Account created successfully! Please check your email to verify your account.';
        this.signupForm.reset();

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        console.log(error);
        this.authService.isLoading.set(false);
        if (error.status === 200 && error.error?.text?.includes('Email already exist')) {
          this.errorMessage = 'Email already exists. Please use another email.';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        }
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get role() {
    return this.signupForm.get('role');
  }
  get department() {
    return this.signupForm.get('department');
  }

  get isLoading() {
    console.log(this.authService.isLoading());
    return this.authService.isLoading();
  }
}
