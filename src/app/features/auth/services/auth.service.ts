import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtAuthResponse } from '../../../models/jwt-auth-response.model';
import { LoginRequest } from '../../../models/login-request.model';
import { RegisterRequest } from '../../../models/register-request.model';
import { User } from '../../../models/user.model';
import { CartService } from '../../cart/services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly API_URL = environment.apiUrl;
  private readonly USER_KEY = 'current_user';

  // BehaviorSubject to track authentication state
  private currentUserSubject = new BehaviorSubject<JwtAuthResponse | null> (
    this.getCurrentUserFromStorage()
  );

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { 
  
  }


  register(registerRequest: RegisterRequest): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<User>(`${this.API_URL}/auth/register`, registerRequest, { headers })
      .pipe(
        tap((user: User) => {
          if (environment.enableLogging) {
            console.log('User registered successfully:', user);
          }
        }),
        catchError(this.handleError)
      );
  }

    login(request: LoginRequest): Observable<JwtAuthResponse> {
      const headers = { 'Content-Type': 'application/json' };
    return this.http.post<JwtAuthResponse>(`${this.API_URL}/auth/login`, 
      request, 
      { headers })
      .pipe(tap(response => {
        // Store user details and JWT in local storage
        this.setCurrentUser(response);
        if (environment.enableLogging) {
          console.log('User logged in successfully:', response);
        }

        return response;
      }));
  }

   /**
   * Logout user and clear stored data
   */
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    
    // Clear current user subject
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/login']);
    
    if (environment.enableLogging) {
      console.log('User logged out successfully');
    }
  }


  getCurrentUser(): JwtAuthResponse | null {
    return this.currentUserSubject.value;
  }


  private setCurrentUser(authResponse: JwtAuthResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse));  
    this.currentUserSubject.next(authResponse);
  }



  /**
   * Private method to get user from localStorage
   */
  private getCurrentUserFromStorage(): JwtAuthResponse | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from storage:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser || !currentUser.accessToken) {
      return false;
    }

    //checking token expiry
    if (this.isTokenExpired(currentUser.accessToken)) {
      this.logout();
      return false;
    }
    
    return true;
  }

  /**
 * Check if JWT token is expired by decoding it and checking the exp claim
 */
private isTokenExpired(token: string): boolean {
  try {

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return true; // Invalid token format
    }
    
    // Decode the payload
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Check if token has expiration claim
    if (!payload.exp) {
      return false; // No expiration, consider it valid
    }
    
    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    // Return true if token is expired
    return currentTime > expirationTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Consider invalid if there's an error
  }
}

  private handleError = (error: any) => {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
        default:
          errorMessage = `Error: ${error.status}`;
      }
    }

    if (environment.enableLogging) {
      console.error('Auth Service Error:', error);
    }

    return throwError(() => new Error(errorMessage));
  };
}
