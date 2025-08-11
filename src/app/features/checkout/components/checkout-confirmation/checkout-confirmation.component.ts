import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderResponse } from '../../../../models/order-response.model';
import { OrderService } from '../../../order/services/order.service';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-confirmation.component.html',
  styleUrl: './checkout-confirmation.component.css'
})
export class CheckoutConfirmationComponent implements OnInit {
  orderId: string = '';
  orderDetails: OrderResponse | null = null;
  isLoading: boolean = true;
  error: string | null = null;

   constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
      this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

      if (!this.orderId) {
        this.router.navigate(['/']);
        return;
      }

      const currentOrder = this.orderService.getCurrentOrderResponse();

      if (currentOrder && currentOrder.orderId === this.orderId) {
        this.orderDetails = currentOrder;
        this.isLoading = false;
      
      } else {
        this.loadOrderDetails();
      }
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.orderDetails = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading order details', error);
        this.error = 'Unable to load order details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
