import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { OrderRequest } from '../../../models/order-request.model';
import { OrderResponse, OrderStatus } from '../../../models/order-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Address } from '../../../models/address.model';
import { PaymentInfo } from '../../../models/payment-info.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

   // Store the current order information during checkout process
  private currentOrderRequest: Partial<OrderRequest> = {};
  private currentOrderResponse: OrderResponse | null = null;

  constructor(private http: HttpClient) { }

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/place`, orderRequest).pipe(
      tap(response => {
        this.currentOrderResponse = response;
      })
    );
  }

  getUserOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}`);
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<OrderResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.put<OrderResponse>(`${this.apiUrl}/${orderId}/status`, { params });
  }

    // Set payment info during checkout
  setPaymentInfo(paymentInfo: PaymentInfo): void {
    if (!this.currentOrderRequest.paymentInfo) {
      this.currentOrderRequest.paymentInfo = {
        cardNumber: '',
        nameOnCard: '',
        expiryDate: '',
        cvv: '',
        billingAddressSameAsShipping: false,
        paymentMethod: '',
        paymentMethodToken: ''
      };
    }
    this.currentOrderRequest.paymentInfo.cardNumber = paymentInfo.cardNumber;
    this.currentOrderRequest.paymentInfo.nameOnCard = paymentInfo.nameOnCard;
    this.currentOrderRequest.paymentInfo.expiryDate = paymentInfo.expiryDate;
    this.currentOrderRequest.paymentInfo.cvv = paymentInfo.cvv;
    this.currentOrderRequest.paymentInfo.billingAddressSameAsShipping = paymentInfo.billingAddressSameAsShipping;
  }

  // Get current order request (for multi-step checkout)
  getCurrentOrderRequest(): Partial<OrderRequest> {
    return this.currentOrderRequest;
  }

   getCurrentOrderResponse(): OrderResponse | null {
    return this.currentOrderResponse;
  }

   clearCheckoutData(): void {
    this.currentOrderRequest = {};
    this.currentOrderResponse = null;
  }

  setShippingAddress(address: Address): void {
    this.currentOrderRequest.street = address.street;
    this.currentOrderRequest.city = address.city;
    this.currentOrderRequest.state = address.state;
    this.currentOrderRequest.postalCode = address.postalCode;
    this.currentOrderRequest.country = address.country;
  }

}
