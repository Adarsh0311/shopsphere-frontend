import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { path:'login', component: LoginComponent, title: 'Login to App' },
    { path: 'register', component: RegisterComponent, title: 'Register to App' },
    { path: 'categories', loadComponent: () => import('./features/category/components/category-list/category-list.component').then(m => m.CategoryListComponent), title: 'Product Categories' }
];
