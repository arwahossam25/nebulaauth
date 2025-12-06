
import React from 'react';
import { User, UserRole, MenuItem, Order, OrderStatus, CartItem } from '../types';
import { CustomerDashboard } from './CustomerDashboard';
import { AdminDashboard } from './AdminDashboard';

interface HomeProps {
  user: User;
  onLogout: () => void;
  // Shared Data
  menuItems: MenuItem[];
  orders: Order[];
  // Admin Actions
  onUpdateMenuStatus: (itemId: string, available: boolean) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Customer Actions
  onPlaceOrder: (items: CartItem[], total: number) => void;
}

export const Home: React.FC<HomeProps> = ({ 
  user, 
  onLogout, 
  menuItems, 
  orders, 
  onUpdateMenuStatus, 
  onAddMenuItem,
  onDeleteMenuItem,
  onUpdateOrderStatus,
  onPlaceOrder
}) => {
  if (user.role === UserRole.ADMIN) {
    return (
      <AdminDashboard 
        user={user}
        menuItems={menuItems}
        orders={orders}
        onLogout={onLogout}
        onUpdateMenuStatus={onUpdateMenuStatus}
        onAddMenuItem={onAddMenuItem}
        onDeleteMenuItem={onDeleteMenuItem}
        onUpdateOrderStatus={onUpdateOrderStatus}
      />
    );
  }

  return (
    <CustomerDashboard 
      user={user}
      menuItems={menuItems}
      orders={orders}
      onLogout={onLogout}
      onPlaceOrder={onPlaceOrder}
    />
  );
};
