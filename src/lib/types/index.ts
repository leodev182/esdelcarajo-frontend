// ==================== ENUMS ====================

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type Gender = "UNISEX" | "MALE" | "FEMALE" | "KIDS";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAGO_CONFIRMADO"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export type PaymentMethod = "MOBILE_PAYMENT" | "BANK_TRANSFER" | "CASH";

// ==================== USER ====================

export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== ADDRESS ====================

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== CATEGORY ====================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// ==================== TAG ====================

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== PRODUCT ====================

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  altText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  gender: Gender;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  subcategory?: Subcategory;
  images: ProductImage[];
  variants: ProductVariant[];
  tags?: Array<{ tag: Tag }>;
}

// ==================== CART ====================

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  expiresAt: string;
  createdAt: string;
  variant: ProductVariant & {
    product: Pick<Product, "id" | "name" | "slug">;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartWithTotals extends Cart {
  subtotal: number;
  totalItems: number;
}

// ==================== ORDER ====================

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantSize: string;
  variantColor: string;
  variantGender: Gender;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
  adminNotes?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: Address;
  user?: Pick<User, "id" | "email" | "name" | "phone">;
}

// ==================== FAVORITE ====================

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

// ==================== API RESPONSES ====================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}
