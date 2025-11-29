import React, { useState } from 'react';
import { User, MenuItem, Order, OrderStatus } from '../types';
import { Button } from '../components/Button';
import { LogOut, ClipboardList, ChefHat, Truck, UtensilsCrossed, ToggleLeft, ToggleRight, Clock } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  menuItems: MenuItem[];
  orders: Order[];
  onLogout: () => void;
  onUpdateMenuStatus: (itemId: string, available: boolean) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

enum AdminTab {
  MANAGER = 'MANAGER',
  KITCHEN = 'KITCHEN',
  DELIVERY = 'DELIVERY'
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, 
  menuItems, 
  orders, 
  onLogout,
  onUpdateMenuStatus,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.MANAGER);

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case OrderStatus.PREPARING: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case OrderStatus.READY: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case OrderStatus.DELIVERED: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-white';
    }
  };

  const renderManagerView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map(item => (
        <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-black/30 flex items-center justify-center text-3xl">
            {item.image}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">{item.name}</h3>
            <p className="text-pink-400">${item.price.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => onUpdateMenuStatus(item.id, !item.available)}
            className={`flex flex-col items-center gap-1 transition-colors ${item.available ? 'text-green-400' : 'text-red-400'}`}
          >
            {item.available ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            <span className="text-[10px] font-bold uppercase">{item.available ? 'Active' : 'Hidden'}</span>
          </button>
        </div>
      ))}
    </div>
  );

  const renderKitchenView = () => {
    const activeOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PREPARING);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.length === 0 && (
          <div className="col-span-full text-center text-purple-300/40 py-12">
            <ChefHat className="w-16 h-16 mx-auto mb-4" />
            <p>No active orders in the kitchen.</p>
          </div>
        )}
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
              <span className="font-mono text-pink-300">#{order.id.slice(-4)}</span>
              <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="p-4 flex-1">
              <ul className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-purple-100 flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              {order.status === OrderStatus.PENDING && (
                <Button fullWidth onClick={() => onUpdateOrderStatus(order.id, OrderStatus.PREPARING)}>
                  Start Preparing
                </Button>
              )}
              {order.status === OrderStatus.PREPARING && (
                <Button fullWidth variant="secondary" onClick={() => onUpdateOrderStatus(order.id, OrderStatus.READY)}>
                  Mark Ready
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDeliveryView = () => {
    const deliveryOrders = orders.filter(o => o.status === OrderStatus.READY);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryOrders.length === 0 && (
          <div className="col-span-full text-center text-purple-300/40 py-12">
            <Truck className="w-16 h-16 mx-auto mb-4" />
            <p>No orders ready for delivery.</p>
          </div>
        )}
        {deliveryOrders.map(order => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
              <div>
                <span className="font-mono text-pink-300 mr-2">#{order.id.slice(-4)}</span>
                <span className="text-white text-sm">{order.customerName}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="p-4 flex-1">
              <div className="text-purple-200/60 text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> 
                {order.timestamp.toLocaleTimeString()}
              </div>
              <p className="text-white font-bold text-lg">${order.total.toFixed(2)}</p>
              <p className="text-sm text-purple-300 mt-2">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items to deliver</p>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              <Button fullWidth variant="primary" onClick={() => onUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}>
                Mark Delivered
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-300/50 text-sm">Logged in as {user.username}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout} className="!py-2 !px-4">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
        <button 
          onClick={() => setActiveTab(AdminTab.MANAGER)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
            activeTab === AdminTab.MANAGER 
            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
            : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" /> Manager (Menu)
        </button>
        <button 
          onClick={() => setActiveTab(AdminTab.KITCHEN)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
            activeTab === AdminTab.KITCHEN 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          <ChefHat className="w-5 h-5" /> Kitchen Staff
        </button>
        <button 
          onClick={() => setActiveTab(AdminTab.DELIVERY)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
            activeTab === AdminTab.DELIVERY 
            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
            : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          <Truck className="w-5 h-5" /> Delivery Boy
        </button>
      </div>

      {/* Content Area */}
      <div className="animation-fade-in">
        {activeTab === AdminTab.MANAGER && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Manage Menu Availability</h2>
              <div className="text-sm text-purple-300/60 flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Active</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Hidden</span>
              </div>
            </div>
            {renderManagerView()}
          </div>
        )}
        
        {activeTab === AdminTab.KITCHEN && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Kitchen Orders</h2>
              <p className="text-sm text-purple-300/60">Move orders from Pending to Ready.</p>
            </div>
            {renderKitchenView()}
          </div>
        )}

        {activeTab === AdminTab.DELIVERY && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Delivery Dispatch</h2>
              <p className="text-sm text-purple-300/60">Mark ready orders as delivered.</p>
            </div>
            {renderDeliveryView()}
          </div>
        )}
      </div>
    </div>
  );
};