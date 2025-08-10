import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { COUNTRIES } from '../../../../constants/app.constants';
import { OrderService } from '../../../order/services/order.service';
import { Address } from '../../../../models/address.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-shipping.component.html',
  styleUrl: './checkout-shipping.component.css'
})
export class CheckoutShippingComponent implements OnInit {
  @Output() shippingComplete = new EventEmitter<void>();

  shippingForm!: FormGroup;
  formSubmitted = false;

  countries = COUNTRIES;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService
  ) {}

    ngOnInit(): void {
    this.initForm();
    
    // Pre-fill form if shipping address exists in order service
    const currentOrder = this.orderService.getCurrentOrderRequest();
    
  }

  initForm(): void {
    this.shippingForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      country: [this.countries[0], [Validators.required]],
      addressType: ['', [Validators.required, Validators.pattern('^(billing|shipping)$')]]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.shippingForm.valid) {
      const shippingAddress: Address = this.shippingForm.value;
      this.orderService.setShippingAddress(shippingAddress);
      this.shippingComplete.emit();
    } else {
      // Mark all fields as touched to trigger validation visuals
      Object.keys(this.shippingForm.controls).forEach(key => {
        const control = this.shippingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.shippingForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched || this.formSubmitted);
  }

  // Helper methods for form validation
  get f() { return this.shippingForm.controls; }

}
