export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface User {
  username: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  HOME = 'HOME'
}

export type CustomerView = 'home' | 'orders' | 'contact';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
}