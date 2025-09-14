import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../../../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
      this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Login successful!');
          this.cartService.mergeCartsOnLogin().subscribe();

          // Route based on user role
          if (response.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Login failed. Please try again.';
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

    getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return 'Password must be at least 6 characters long';
      }
    }
    return '';
  }

}
