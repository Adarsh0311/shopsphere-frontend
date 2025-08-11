import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartResponse } from '../../../../models/cart-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Address } from '../../../../models/address.model';
import { STATE_TAXES } from '../../../../constants/app.constants';
import { CartService } from '../../../cart/services/cart.service';
import { OrderService } from '../../../order/services/order.service';
import { OrderRequest } from '../../../../models/order-request.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.css'
})
export class CheckoutReviewComponent implements OnInit{

  @Input() cartData!: CartResponse;
  @Output() orderPlaced = new EventEmitter<string>();
  @Output() goBack = new EventEmitter<void>();

  notesForm!: FormGroup;
  shippingAddress?: Address;
  paymentMethod: string = '';
  isSubmitting = false;
  orderError: string | null = null;

  get subtotal(): number {
    return this.cartData? this.cartData.totalAmount : 0;
  }

  get shippingCost(): number {
    return this.subtotal >= 35 ? 0 : 10;
  }

  get tax(): number {
    return this.subtotal * this.stateTaxRate;
  }

  get stateTaxRate(): number {
    return 0.08;
    //return this.shippingAddress ? STATE_TAXES[this.shippingAddress.state as keyof typeof STATE_TAXES] || 0 : 0;
  }

  get total(): number {
    return this.subtotal + this.shippingCost + this.tax;
  }


    constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private cartService: CartService
  ) { }

    ngOnInit(): void {
    this.notesForm = this.fb.group({
      orderNotes: ['']
    });
    
    // Get shipping and payment info from order service
    const currentOrder = this.orderService.getCurrentOrderRequest();
    this.setShippingAddress(currentOrder);
    
    // Show last 4 digits of card
    if (currentOrder.paymentInfo && currentOrder.paymentInfo.cardNumber) {
      const cardNumber = currentOrder.paymentInfo.cardNumber;
      this.paymentMethod = `Credit Card ending in ${cardNumber.substring(cardNumber.length - 4)}`;
    }
  }

  setShippingAddress(orderRequest: Partial<OrderRequest>): void {
    if (!this.shippingAddress) {
      this.shippingAddress = {} as Address;
    }
    this.shippingAddress.city = orderRequest.city || '';
    this.shippingAddress.state = orderRequest.state || '';
    this.shippingAddress.postalCode = orderRequest.postalCode || '';
    this.shippingAddress.country = orderRequest.country || '';
    this.shippingAddress.street = orderRequest.street || '';
  }

  placeOrder(): void {
    if (!this.shippingAddress) {
      this.orderError = 'Shipping information is missing. Please go back and complete the shipping step.';
      return;
    }

    if (!this.cartData || !this.cartData.cartId) {
      this.orderError = 'Cart information is not available. Please try again.';
      return;
    }

    this.isSubmitting = true;
    this.orderError = null;

    const orderRequest: OrderRequest = this.createAndGetOrderRequest();

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.cartService.clearCart();
        this.orderPlaced.emit(response.orderId);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error placing order', error);
        this.orderError = 'Failed to place order. ' + (error?.error?.message || 'Try again later.');
      }
    });
  }

  onBack(): void {
    this.goBack.emit();
  }

  createAndGetOrderRequest(): OrderRequest {
    return {
      street: this.shippingAddress?.street || '',
      city: this.shippingAddress?.city || '',
      state: this.shippingAddress?.state || '',
      postalCode: this.shippingAddress?.postalCode || '',
      country: this.shippingAddress?.country || '',
      paymentMethod: this.paymentMethod,
      paymentMethodToken: '',
      orderNotes: this.notesForm.value.orderNotes || '',
      paymentInfo: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        billingAddressSameAsShipping: false,
        paymentMethod: '',
        paymentMethodToken: ''
      }
    };
  }

dismissError() {
  this.orderError = null;
}
}
