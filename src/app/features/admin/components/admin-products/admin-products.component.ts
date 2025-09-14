import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ProductResponse } from '../../../../models/product-response.model';
import { ProductCreateRequest, ProductUpdateRequest } from '../../../../models/admin.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-products">
      <div class="page-header">
        <h1>Product Management</h1>
        <button class="add-btn" (click)="openAddProductModal()">
          <i class="fas fa-plus"></i>
          Add Product
        </button>
      </div>

      <div class="products-grid" *ngIf="!isLoading">
        <div *ngFor="let product of products" class="product-card">
          <div class="product-image">
            <img [src]="product.imageUrl || '/assets/images/placeholder.jpg'" [alt]="product.name">
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="product-price">\${{ product.price | number:'1.2-2' }}</p>
            <p class="product-stock">Stock: {{ product.stockQuantity }}</p>
            <div class="product-actions">
              <button class="edit-btn" (click)="editProduct(product)">Edit</button>
              <button class="delete-btn" (click)="deleteProduct(product.productId)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showProductModal" class="modal-overlay" (click)="closeProductModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <form (ngSubmit)="saveProduct()" class="product-form">
            <h2>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h2>
            
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" [(ngModel)]="productForm.name" name="name" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="productForm.description" name="description" class="form-control"></textarea>
            </div>
            
            <div class="form-group">
              <label>Price</label>
              <input type="number" [(ngModel)]="productForm.price" name="price" step="0.01" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>Stock Quantity</label>
              <input type="number" [(ngModel)]="productForm.stockQuantity" name="stock" required class="form-control">
            </div>
            
            <div class="form-actions">
              <button type="button" (click)="closeProductModal()" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn">{{ isEditMode ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  isLoading = true;
  showProductModal = false;
  isEditMode = false;
  
  productForm: ProductCreateRequest = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    categoryId: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.adminService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  openAddProductModal(): void {
    this.isEditMode = false;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      categoryId: ''
    };
    this.showProductModal = true;
  }

  editProduct(product: ProductResponse): void {
    this.isEditMode = true;
    this.productForm = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId || ''
    };
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
  }

  saveProduct(): void {
    if (this.isEditMode) {
      // Update existing product
      const updateRequest: ProductUpdateRequest = {
        productId: '', // You'd need to store the current product ID
        ...this.productForm
      };
      // Handle update
    } else {
      // Create new product
      this.adminService.createProduct(this.productForm).subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.closeProductModal();
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    }
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.productId !== productId);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}
