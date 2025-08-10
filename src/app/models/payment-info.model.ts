export interface PaymentInfo {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
  billingAddressSameAsShipping: boolean;
  paymentMethod: string;
  paymentMethodToken: string; //token provided from payment gateway
}