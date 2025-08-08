import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = inject(AuthService);
    const currentUser = authService.getCurrentUser();

    if (currentUser && currentUser.accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `${currentUser.tokenType} ${currentUser.accessToken}`
        }
      });

      if (environment.enableLogging) {
        console.log('Request made with Authorization header:', req);
      }
    }

    return next.handle(req);
  }
}
