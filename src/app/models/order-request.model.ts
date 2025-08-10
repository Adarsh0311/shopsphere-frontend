    export interface OrderRequest {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;

        paymentMethod: string;
        paymentMethodToken: string; 
    }