import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../../../models/product-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  quantity: number = 1;
  product: ProductResponse | null = null;
  relatedProducts: ProductResponse[] = [];
  errquantity: number = 1;
  isLoading: boolean = true;
  errorMessage: string = '';
  addedToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.loadProductDetails(productId);
    }
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        this.loadRelatedProducts(product.categoryId);
      },
      error: (error) => {
        console.error('Error loading product details', error);
        this.errorMessage = 'Failed to load product details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

    loadRelatedProducts(categoryId: string): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        // Filter out the current product and limit to 4 related products
        this.relatedProducts = products
          .filter(p => p.productId !== this.product?.productId)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products', error);
      }
    });
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

addToCart(): void {
  if (this.product) {
    this.cartService.addToCart({
      productId: this.product.productId,
      quantity: this.quantity,
      price: this.product.price
    }).subscribe({
      next: () => {
        this.addedToCart = true;
        setTimeout(() => {
          this.addedToCart = false;
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error adding to cart', error);
        // Could show error notification here
      }
    });
  }
}

  isOutOfStock(): boolean {
    return this.product ? this.product.stockQuantity <= 0 : false;
  }

}  
