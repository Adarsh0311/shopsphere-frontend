import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductByCategoryComponent } from './product-by-category.component';

describe('ProductByCategoryComponent', () => {
  let component: ProductByCategoryComponent;
  let fixture: ComponentFixture<ProductByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductByCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
