// Product creation/update models for admin
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  imageUrl?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  brand?: string;
  tags?: string[];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  productId: string;
}

// Category creation/update models for admin
export interface CategoryCreateRequest {
  name: string;
  description?: string;
  parentCategoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {
  categoryId: string;
}

// Admin dashboard statistics
export interface AdminDashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: AdminOrderSummary[];
}

export interface AdminOrderSummary {
  orderId: string;
  customerName: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
  itemCount: number;
}

// Order management for admin
export interface OrderUpdateRequest {
  orderId: string;
  status?: string;
  trackingNumber?: string;
  notes?: string;
}

// User management for admin
export interface UserManagementResponse {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  registrationDate: Date;
  lastLogin?: Date;
  isActive: boolean;
  roles: string[];
  totalOrders: number;
  totalSpent: number;
}

// Admin activity log
export interface AdminActivityLog {
  activityId: string;
  adminId: string;
  adminUsername: string;
  action: string;
  targetType: 'PRODUCT' | 'CATEGORY' | 'ORDER' | 'USER';
  targetId: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
}
