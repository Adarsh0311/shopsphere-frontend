import { Component, OnInit } from '@angular/core';
// Update the path below to the correct relative path where cart.service.ts actually exists
import { CartService } from '../../../cart/services/cart.service';
import { OrderService } from '../../../order/services/order.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartResponse } from '../../../../models/cart-response.model';
import { CheckoutShippingComponent } from "../checkout-shipping/checkout-shipping.component";
import { CheckoutPaymentComponent } from "../checkout-payment/checkout-payment.component";
import { CheckoutReviewComponent } from "../checkout-review/checkout-review.component";

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule,
    RouterModule, CheckoutShippingComponent, CheckoutPaymentComponent, CheckoutReviewComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  cartData: any = null;
  isLoading = true;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe(
      (cartResponse: CartResponse | null) => {
        this.cartData = cartResponse;
        this.isLoading = false;

        //redirect to cart page if response is empty
        if (!cartResponse || !cartResponse.items || cartResponse.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      (error: any) => {
        console.error('Error loading cart data:', error);
        this.isLoading = false;
      }
    );
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  onShippingComplete(): void {
    this.nextStep();
  }
  
  onPaymentComplete(): void {
    this.nextStep();
  }

    onOrderPlaced(orderId: string): void {
    // Navigate to order confirmation
    this.router.navigate(['/checkout/confirmation', orderId]);
  }

}
