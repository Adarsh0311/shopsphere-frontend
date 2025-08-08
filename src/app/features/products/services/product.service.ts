import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductResponse } from '../../../models/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProductsByCategory(categoryId: string): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductById(productId: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${productId}`);
  }
}
