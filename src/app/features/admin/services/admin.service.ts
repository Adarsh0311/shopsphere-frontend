import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  AdminDashboardStats, 
  ProductCreateRequest, 
  ProductUpdateRequest,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  OrderUpdateRequest,
  UserManagementResponse,
  AdminActivityLog
} from '../../../models/admin.model';
import { ProductResponse } from '../../../models/product-response.model';
import { CategoryResponse } from '../../../models/category-response.model';
import { OrderResponse } from '../../../models/order-response.model';
import { ApiResponse } from '../../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('current_user');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      const authData = JSON.parse(token);
      headers = headers.set('Authorization', `Bearer ${authData.accessToken}`);
    }

    return headers;
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.API_URL}/admin/dashboard/stats`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Product Management
  getAllProducts(page: number = 0, size: number = 10, sortBy: string = 'name'): Observable<ApiResponse<ProductResponse[]>> {
    const params = { page: page.toString(), size: size.toString(), sortBy };
    return this.http.get<ApiResponse<ProductResponse[]>>(`${this.API_URL}/admin/products`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  createProduct(product: ProductCreateRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.API_URL}/admin/products`, product, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateProduct(product: ProductUpdateRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.API_URL}/admin/products/${product.productId}`, product, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/products/${productId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getProductById(productId: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API_URL}/admin/products/${productId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Category Management
  getAllCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.API_URL}/admin/categories`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  createCategory(category: CategoryCreateRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.API_URL}/admin/categories`, category, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateCategory(category: CategoryUpdateRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.API_URL}/admin/categories/${category.categoryId}`, category, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/categories/${categoryId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Order Management
  getAllOrders(page: number = 0, size: number = 10, status?: string): Observable<ApiResponse<OrderResponse[]>> {
    let params: any = { page: page.toString(), size: size.toString() };
    if (status) {
      params.status = status;
    }
    
    return this.http.get<ApiResponse<OrderResponse[]>>(`${this.API_URL}/admin/orders`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.API_URL}/admin/orders/${orderId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateOrderStatus(orderUpdate: OrderUpdateRequest): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.API_URL}/admin/orders/${orderUpdate.orderId}/status`, orderUpdate, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // User Management
  getAllUsers(page: number = 0, size: number = 10): Observable<ApiResponse<UserManagementResponse[]>> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<ApiResponse<UserManagementResponse[]>>(`${this.API_URL}/admin/users`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  getUserById(userId: string): Observable<UserManagementResponse> {
    return this.http.get<UserManagementResponse>(`${this.API_URL}/admin/users/${userId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  toggleUserStatus(userId: string): Observable<UserManagementResponse> {
    return this.http.put<UserManagementResponse>(`${this.API_URL}/admin/users/${userId}/toggle-status`, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Activity Logs
  getActivityLogs(page: number = 0, size: number = 20): Observable<ApiResponse<AdminActivityLog[]>> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<ApiResponse<AdminActivityLog[]>>(`${this.API_URL}/admin/activity-logs`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  // Image Upload
  uploadProductImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    // Remove content-type header for multipart/form-data
    const headers = new HttpHeaders();
    const token = localStorage.getItem('current_user');
    if (token) {
      const authData = JSON.parse(token);
      headers.set('Authorization', `Bearer ${authData.accessToken}`);
    }

    return this.http.post<{ imageUrl: string }>(`${this.API_URL}/admin/upload/product-image`, formData, {
      headers
    }).pipe(catchError(this.handleError));
  }

  // Search functionality
  searchProducts(query: string, page: number = 0, size: number = 10): Observable<ApiResponse<ProductResponse[]>> {
    const params = { q: query, page: page.toString(), size: size.toString() };
    return this.http.get<ApiResponse<ProductResponse[]>>(`${this.API_URL}/admin/products/search`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  searchOrders(query: string, page: number = 0, size: number = 10): Observable<ApiResponse<OrderResponse[]>> {
    const params = { q: query, page: page.toString(), size: size.toString() };
    return this.http.get<ApiResponse<OrderResponse[]>>(`${this.API_URL}/admin/orders/search`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  searchUsers(query: string, page: number = 0, size: number = 10): Observable<ApiResponse<UserManagementResponse[]>> {
    const params = { q: query, page: page.toString(), size: size.toString() };
    return this.http.get<ApiResponse<UserManagementResponse[]>>(`${this.API_URL}/admin/users/search`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
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
          errorMessage = 'Unauthorized access';
          break;
        case 403:
          errorMessage = 'Access forbidden - Admin privileges required';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
        default:
          errorMessage = `Error: ${error.status}`;
      }
    }

    if (environment.enableLogging) {
      console.error('Admin Service Error:', error);
    }

    return throwError(() => new Error(errorMessage));
  };
}
