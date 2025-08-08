export interface ProductResponse {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  categoryId: number;
  categoryName?: string;
}