import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';


export class AuthInterceptor implements HttpInterceptor {

  private readonly privateEndpoints = ['/api/order', '/api/cart'];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = inject(AuthService);
    const currentUser = authService.getCurrentUser();

    if (this.privateEndpoints.some(endpoint => req.url.includes(endpoint)) && currentUser && currentUser.accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `${currentUser.tokenType} ${currentUser.accessToken}`
        }
      });

      if (environment.enableLogging) {
        console.log('Request made with Authorization header:', req);
      }
    }

    return next.handle(req).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('Token invalid or expired');
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
