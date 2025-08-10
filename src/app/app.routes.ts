import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/categories', pathMatch: 'full' },
    { path:'login', component: LoginComponent, title: 'Login' },
    { path: 'register', component: RegisterComponent, title: 'Register' },
    { path: 'categories', loadComponent: () => import('./features/category/components/category-list/category-list.component').then(m => m.CategoryListComponent), title: 'Product Categories' },
    { path: 'products/category/:categoryId', loadComponent: () => import('./features/products/components/product-by-category/product-by-category.component').then(m => m.ProductByCategoryComponent), title: 'Products by Category' },
    { path: 'products/:productId', loadComponent: () => import('./features/products/components/product-detail/product-detail.component').then(m => m.ProductDetailComponent), title: 'Product Details' },
    { path: 'cart', loadComponent: () => import('./features/cart/components/cart-page/cart-page.component').then(m => m.CartPageComponent), title: 'Shopping Cart' }
];
