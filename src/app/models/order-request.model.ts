import { PaymentInfo } from "./payment-info.model";

    export interface OrderRequest {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;

        paymentMethod: string;
        paymentMethodToken: string;
        orderNotes: string;
        paymentInfo: PaymentInfo;
    }