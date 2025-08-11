
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}


export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// OrderItemResponse interface (reference)
export interface OrderItemResponse {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Main OrderResponse interface
export interface OrderResponse {
  orderId: string;
  userId: string;
  username: string;
  orderDate: Date;
  totalAmount: number;
  status: OrderStatus;
  
  // Shipping Address details
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  
  // Payment details
  paymentMethod: string;
  paymentTransactionId: string;
  paymentStatus: PaymentStatus;
  paymentDate: Date;
  
  items: OrderItemResponse[];

  estimatedDelivery: Date;
}