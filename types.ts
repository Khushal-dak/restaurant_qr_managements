
export enum Role {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PLACED = 'placed',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  CANCELED = 'canceled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Table {
  id: string;
  number: number;
  qrSlug: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  availability: boolean;
  tags: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  note: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  note: string;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
}
