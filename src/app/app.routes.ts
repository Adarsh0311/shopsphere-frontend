import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './features/admin/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/categories', pathMatch: 'full' },
    { path:'login', component: LoginComponent, title: 'Login' },
    { path: 'register', component: RegisterComponent, title: 'Register' },
    { path: 'categories', loadComponent: () => import('./features/category/components/category-list/category-list.component').then(m => m.CategoryListComponent), title: 'Product Categories' },
    { path: 'products/category/:categoryId', loadComponent: () => import('./features/products/components/product-by-category/product-by-category.component').then(m => m.ProductByCategoryComponent), title: 'Products by Category' },
    { path: 'products/:productId', loadComponent: () => import('./features/products/components/product-detail/product-detail.component').then(m => m.ProductDetailComponent), title: 'Product Details' },
    { path: 'cart', loadComponent: () => import('./features/cart/components/cart-page/cart-page.component').then(m => m.CartPageComponent), title: 'Shopping Cart' },
    { path: 'checkout', 
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/checkout/components/checkout-page/checkout-page.component').then(m => m.CheckoutPageComponent), 
        title: 'Checkout' 
    },
    { 
        path: 'checkout/confirmation/:orderId', 
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/checkout/components/checkout-confirmation/checkout-confirmation.component').then(m => m.CheckoutConfirmationComponent), 
        title: 'Order Confirmation' 
    },
    
    // Admin Routes
    {
        path: 'admin/login',
        loadComponent: () => import('./features/admin/components/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
        title: 'Admin Login'
    },
    {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
                title: 'Admin Dashboard'
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/components/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
                title: 'Manage Orders'
            },
            {
                path: 'products',
                loadComponent: () => import('./features/admin/components/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
                title: 'Manage Products'
            },
            {
                path: 'categories',
                loadComponent: () => import('./features/admin/components/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
                title: 'Manage Categories'
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
