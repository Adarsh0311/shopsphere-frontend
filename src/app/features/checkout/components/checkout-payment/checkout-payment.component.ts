import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../order/services/order.service';
import { PaymentInfo } from '../../../../models/payment-info.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.css'
})
export class CheckoutPaymentComponent implements OnInit {
  @Output() paymentComplete = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  
  paymentForm!: FormGroup;
  formSubmitted = false;

   constructor(
    private fb: FormBuilder,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

     // Pre-fill form if payment info exists in order service
    const currentOrder = this.orderService.getCurrentOrderRequest();
    if (currentOrder.paymentMethod) {
      this.paymentForm.patchValue({
        paymentMethod: currentOrder.paymentMethod,
        paymentMethodToken: currentOrder.paymentMethodToken
      });
    }
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{16}$')
      ]],
      nameOnCard: ['', [
        Validators.required, 
        Validators.minLength(3)
      ]],
      expiryDate: ['', [
        Validators.required, 
        Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')
      ]],
      cvv: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{3,4}$')
      ]],
      billingAddressSameAsShipping: [true]
    });
  }

  
  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.paymentForm.valid) {
      const paymentInfo: PaymentInfo = this.paymentForm.value;
      this.orderService.setPaymentInfo(paymentInfo);
      this.paymentComplete.emit();
    } else {
      // Mark all fields as touched to trigger validation visuals
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onBack(): void {
    this.goBack.emit();
  }

    // Card number formatting (adds spaces for readability)
  formatCardNumber(event: any): void {
    // const input = event.target as HTMLInputElement;
    // let value = input.value.replace(/\s/g, '');
    
    // if (value.length > 16) {
    //   value = value.substr(0, 16);
    // }
    
    // // Only update if it's a valid input
    // if (/^[0-9]*$/.test(value)) {
    //   this.paymentForm.patchValue({ cardNumber: value });
    // }
  }

    // Expiry date formatting (adds slash after month)
  formatExpiryDate(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 2) {
        // Just the month
        value = value;
      } else {
        // Month and year
        const month = value.substring(0, 2);
        const year = value.substring(2, 4);
        value = `${month}/${year}`;
      }
      
      this.paymentForm.patchValue({ expiryDate: value });
    }
  }

  // Helper methods for form validation
  get f() { return this.paymentForm.controls; }

  isInvalid(controlName: string): boolean {
    const control = this.paymentForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched || this.formSubmitted);
  }
}
