import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartResponse } from '../../../../models/cart-response.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  isLoading: boolean = true;
  cartResponse: CartResponse | null = null;
  cartItems: any[] = [];
  cartTotal: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.cartResponse = response;
        this.cartItems = response && response.items ? response.items : [];
        this.isLoading = false;
        this.cartTotal = response ? response.totalAmount : 0;
      },

      error: (error) => {
        console.error('Error loading cart', error);
        this.isLoading = false;
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => console.error('Error removing item', error)
    });
  }

    updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) newQuantity = 1;
    
    this.cartService.updateProductQuantity(item.productId, newQuantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => console.error('Error updating quantity', error)
    });
  }

    clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCart();
        },
        error: (error) => console.error('Error clearing cart', error)
      });
    }
  }

}
