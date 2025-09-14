import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../features/cart/services/cart.service';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isMenuOpen: boolean = false;
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.getCartItems().subscribe(cartResponse => {
      if (cartResponse) {
        this.cartItemCount = cartResponse.items.reduce((count, item) => count + item.quantity, 0);
        console.log('Cart:', cartResponse);
        this.totalAmount = cartResponse.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    });

    // Subscribe to auth state
    this.checkAuthState();
    
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'ROLE_ADMIN';
    });
  }

  private checkAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  search(): void {
    if (this.searchQuery.trim()) {
      //TODO: implement later
      console.log('Searching for:', this.searchQuery);
    }
  }
}