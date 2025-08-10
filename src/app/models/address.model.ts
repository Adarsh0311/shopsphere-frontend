import { User } from "./user.model";

export interface Address {
  addressId: string;
  user?: User; // Optional due to potential null value in relationship
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: string;
  createdAt: Date;
  updatedAt: Date;
}