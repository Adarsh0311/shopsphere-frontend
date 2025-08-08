import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartItem } from '../../../models/cart-item.model';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartResponse } from '../../../models/cart-response.model';
import { AddToCartRequest } from '../../../models/add-to-cart-request.model';
import { CartItemResponse } from '../../../models/cart-item.-response.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartResponse: CartResponse | null = null;
  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  private apiUrl = `${environment.apiUrl}/cart`;
  cartItems: any;

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.loadCart();
  }

    addToCart(addToCartRequest: AddToCartRequest): Observable<any> {
    // If user is logged in, sync with server, otherwise just update local
    if (this.authService.isLoggedIn()) {
      return this.syncCartWithServer(addToCartRequest);

    } else {
      this.updateLocalCart(addToCartRequest);
      return of(this.cartResponse);
    }
  }
  syncCartWithServer(addToCartRequest: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/add`, addToCartRequest);
  }
  updateLocalCart(addToCartRequest: AddToCartRequest) {
    const cartString = localStorage.getItem('cart');
    const cart: CartResponse | null = cartString ? JSON.parse(cartString) : null;
    if (!cart) {
      this.cartResponse = {
        cartId: '',
        userId: '',
        username: '',
        items: [],
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.cartResponse.items.push({
        productId: addToCartRequest.productId,
        price: addToCartRequest.price,
        quantity: addToCartRequest.quantity,
        itemTotal: addToCartRequest.price * addToCartRequest.quantity,
        id: '',
        productName: ''
      });
      this.cartResponse.totalAmount = this.getCartTotalAmount(this.cartResponse);
    } 
    else if (cart) {
      let item = cart.items.find(item => item.productId == addToCartRequest.productId);
      if (item) {
        item.quantity = addToCartRequest.quantity;
        item.itemTotal = item.price * item.quantity;
      } 
      else {
        let newItem: CartItemResponse = {
          productId: addToCartRequest.productId,
          price: addToCartRequest.price,
          quantity: addToCartRequest.quantity,
          itemTotal: addToCartRequest.price * addToCartRequest.quantity,
          id: '',
          productName: ''
        }
        cart.items.push(newItem);
      }

      cart.totalAmount = this.getCartTotalAmount(cart);
      this.cartResponse = cart;
  
    }

    localStorage.setItem('cart', JSON.stringify(this.cartResponse));
    this.cartSubject.next(this.cartResponse);
  }

  clearCart(): void {
    if (this.authService.isLoggedIn()) {
      this.http.delete<CartResponse>(`${this.apiUrl}/clear`).subscribe({
        next: (response) => {
          this.cartResponse = response;
        },
        error: (error) => {
          console.error('Error clearing cart', error);
        }
      });
    }
    else {
      this.cartResponse = null;
      localStorage.removeItem('cart');
      this.cartSubject.next(this.cartResponse);
    }

  }

  updateProductQuantity(productId: string, quantity: number) {
    if (this.authService.isLoggedIn()) {
      return this.http.put<CartResponse>(`${this.apiUrl}/update/${productId}`, {HttpParams: {'quantity': quantity }});
    } else {
      this.updateLocalCartQuantity(productId, quantity);
      return of(this.cartResponse);
    }
  }

  getCartItems(): Observable<CartResponse | null> {
    return this.cartSubject.asObservable();
  }

  updateLocalCartQuantity(productId: string, quantity: number) {
    if (!this.cartResponse) return;

    const item = this.cartResponse.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      item.itemTotal = item.price * item.quantity;
    }

    this.cartResponse.totalAmount = this.getCartTotalAmount(this.cartResponse);
    localStorage.setItem('cart', JSON.stringify(this.cartResponse));
    this.cartSubject.next(this.cartResponse);
  }

  removeProductFromCart(productId: string): Observable<CartResponse | null> {
    if (this.authService.isLoggedIn()) {
      return this.http.delete<CartResponse>(`${this.apiUrl}/remove/${productId}`);
    } else {
      this.updateLocalCartAfterRemoval(productId);
      return of(this.cartResponse);
    }
  }
  updateLocalCartAfterRemoval(productId: string) {
    if (!this.cartResponse) return;

    this.cartResponse.items = this.cartResponse.items.filter(item => item.productId !== productId);
    this.cartResponse.totalAmount = this.getCartTotalAmount(this.cartResponse);
    localStorage.setItem('cart', JSON.stringify(this.cartResponse));
    this.cartSubject.next(this.cartResponse);
  }

    // Called when user logs in - merges local cart with server cart
  mergeCartsOnLogin(): Observable<CartResponse> {
    const localCart = this.getLocalCart();
    
    if (localCart.length === 0) {
      // If local cart is empty, just load from server
      return this.fetchCartFromServer();
    }
    
    // Send local cart to server for merging
    return this.http.post<CartResponse>(`${this.apiUrl}/merge`, { items: localCart }).pipe(
      tap((response: CartResponse) => {
        localStorage.removeItem('cart');
        this.fetchCartFromServer().subscribe(response => {
          this.cartResponse = response;
        });
      }),
      catchError(error => {
        console.error('Error merging carts', error);
        return throwError(() => error);
      })
    );
  }

  private fetchCartFromServer(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}`);
  }

  private getCartTotalAmount(cart: CartResponse): number {
    return cart.items.reduce((accumulator, item) => {
      return accumulator + item.itemTotal;
    }, 0);
  }

  private loadCart(): void {
    const currentUser = this.authService.getCurrentUser();;
    if (currentUser) {
      this.loadCartFromDatabase();
    }
    else {
      this.loadLocalCart();
    }
  }

  private loadCartFromDatabase() {
     this.http.get<CartResponse>(`${this.apiUrl}`).subscribe({
        next: (response) => {
          this.cartResponse = response;
          this.cartSubject.next(response);
        },
        error: (error) => {
          console.error('Error loading cart', error);
        }
      });
  }

  private loadLocalCart(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartResponse = JSON.parse(cart);
      this.cartSubject.next(this.cartResponse);
    }
    
  }

    private getLocalCart(): CartItem[] {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error('Error parsing cart from local storage', e);
        localStorage.removeItem('cart');
      }
    }
    return [];
  }



}
