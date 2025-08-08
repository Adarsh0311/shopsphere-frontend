import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../category/services/category.service';
import { ProductResponse } from '../../../../models/product-response.model';
import { CategoryResponse } from '../../../../models/category-response.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-by-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-by-category.component.html',
  styleUrl: './product-by-category.component.css'
})
export class ProductByCategoryComponent implements OnInit {
  products: ProductResponse[] = [];
  category: CategoryResponse | null = null;
  isLoading = true;
  errorMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.isLoading = true;
        const categoryId: string = params['categoryId'];
        
        // First get the category details
        return this.categoryService.getCategoryById(categoryId).pipe(
          switchMap(category => {
            this.category = category;
            // Then get products for this category
            return this.productService.getProductsByCategory(categoryId);
          })
        );
      })
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products by category', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}