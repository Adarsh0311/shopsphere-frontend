import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginRequest } from '../../../../models/login-request.model';
import { UserRole } from '../../../../models/role.model';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  adminCredentials: LoginRequest = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in as admin
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onAdminLogin(): void {
    if (this.adminCredentials.username && this.adminCredentials.password) {
      this.isLoading = true;
      this.errorMessage = '';

      // Use the same login endpoint but check role after login
      this.authService.login(this.adminCredentials).subscribe({
        next: (response) => {
          // Check if the user has admin role
          if (response.role === UserRole.ADMIN) {
            console.log('Admin login successful');
            this.router.navigate(['/admin/dashboard']);
          } else {
            // User is not an admin
            this.authService.logout(); // Clear the session
            this.errorMessage = 'Access denied. Admin privileges required.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Invalid credentials';
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onBackToUserLogin(): void {
    this.router.navigate(['/login']);
  }
}
