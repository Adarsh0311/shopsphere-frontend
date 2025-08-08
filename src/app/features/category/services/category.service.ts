import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryRequest } from '../../../models/category-request.model';
import { CategoryResponse } from '../../../models/category-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 private apiUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }

  createCategory(categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, categoryRequest);
  }

  updateCategory(id: string, categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, categoryRequest);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategoryByName(name: string): Observable<CategoryResponse> {
    const params = new HttpParams().set('name', name);
    return this.http.get<CategoryResponse>(`${this.apiUrl}/search/name`, { params });
  }
  
}
