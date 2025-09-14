import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AdminDashboardStats } from '../../../../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStats | null = null;
  isLoading = true;
  errorMessage = '';
  currentAdminName = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdminInfo();
    this.loadDashboardStats();
  }

  private loadAdminInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentAdminName = currentUser.username;
    }
  }

  private loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load dashboard statistics';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToOrders(): void {
    this.router.navigate(['/admin/orders']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/admin/products']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/admin/categories']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  refreshStats(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.loadDashboardStats();
  }
}
