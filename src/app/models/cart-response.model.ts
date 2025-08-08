import { CartItemResponse } from "./cart-item.-response.model";

export interface CartResponse {
  cartId: string;
  userId: string;
  username: string;
  items: CartItemResponse[]; // Array of cart items
  totalAmount: number; // Sum of all itemTotals
  createdAt: string | Date;
  updatedAt: string | Date;
}

