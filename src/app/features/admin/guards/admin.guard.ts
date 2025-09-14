import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { UserRole } from '../../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    // Check if user is logged in and has admin role
    if (this.authService.isLoggedIn() && this.authService.hasRole(UserRole.ADMIN)) {
      return true;
    }

    // If not admin or not logged in, redirect to admin login
    return this.router.createUrlTree(['/admin/login']);
  }
}
