import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { OrderResponse, OrderStatus } from '../../../../models/order-response.model';
import { OrderUpdateRequest } from '../../../../models/admin.model';
import { ApiResponse } from '../../../../models/api-response.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  isLoading = true;
  errorMessage = '';
  searchQuery = '';
  selectedStatus = '';
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Order statuses for filtering
  orderStatuses = Object.values(OrderStatus);

  // Selected order for details modal
  selectedOrder: OrderResponse | null = null;
  showOrderDetails = false;

  // Order update
  isUpdatingOrder = false;
  updateOrderRequest: OrderUpdateRequest = {
    orderId: '',
    status: '',
    trackingNumber: '',
    notes: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const observable = this.searchQuery.trim() 
      ? this.adminService.searchOrders(this.searchQuery, this.currentPage, this.pageSize)
      : this.adminService.getAllOrders(this.currentPage, this.pageSize, this.selectedStatus);

    observable.subscribe({
      next: (response: ApiResponse<OrderResponse[]>) => {
        this.orders = response.data || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load orders';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadOrders();
  }

  onStatusFilter(): void {
    this.currentPage = 0;
    this.loadOrders();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.currentPage = 0;
    this.loadOrders();
  }

  viewOrderDetails(order: OrderResponse): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
    this.updateOrderRequest = {
      orderId: order.orderId,
      status: order.status,
      trackingNumber: '',
      notes: ''
    };
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
    this.updateOrderRequest = {
      orderId: '',
      status: '',
      trackingNumber: '',
      notes: ''
    };
  }

  updateOrderStatus(): void {
    if (!this.updateOrderRequest.orderId) return;

    this.isUpdatingOrder = true;

    this.adminService.updateOrderStatus(this.updateOrderRequest).subscribe({
      next: (updatedOrder) => {
        // Update the order in the list
        const index = this.orders.findIndex(o => o.orderId === updatedOrder.orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.selectedOrder = updatedOrder;
        this.isUpdatingOrder = false;
        // Show success message or toast
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update order';
        this.isUpdatingOrder = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  getTotalAmount(order: OrderResponse): number {
    return order.totalAmount;
  }

  getItemCount(order: OrderResponse): number {
    return order.items.length;
  }
}
