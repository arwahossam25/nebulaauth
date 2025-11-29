import React, { useState } from 'react';
import { User, MenuItem, Order, OrderStatus } from '../types';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { LogOut, ChefHat, Truck, UtensilsCrossed, ToggleLeft, ToggleRight, Clock, Plus, Trash2, X } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  menuItems: MenuItem[];
  orders: Order[];
  onLogout: () => void;
  onUpdateMenuStatus: (itemId: string, available: boolean) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onDeleteMenuItem: (itemId: string) => void;
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
  onAddMenuItem,
  onDeleteMenuItem,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.MANAGER);
  
  // Add Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Main',
    image: '🍔'
  });

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category,
      image: newItem.image || '🍽️',
      available: true
    });
    setIsAddingItem(false);
    setNewItem({ name: '', price: '', description: '', category: 'Main', image: '🍔' });
  };

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
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Modify Menu</h2>
          <p className="text-sm text-purple-300/60">Add, remove, or toggle availability of items.</p>
        </div>
        <Button onClick={() => setIsAddingItem(!isAddingItem)} className="!py-2">
          {isAddingItem ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAddingItem ? 'Cancel' : 'Add New Item'}
        </Button>
      </div>

      {/* Add Item Form */}
      {isAddingItem && (
        <form onSubmit={handleAddItemSubmit} className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl animation-fade-in">
          <h3 className="text-lg font-bold text-white mb-4">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Item Name" 
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              required 
            />
            <InputField 
              label="Price ($)" 
              type="number" 
              step="0.01" 
              value={newItem.price} 
              onChange={e => setNewItem({...newItem, price: e.target.value})} 
              required 
            />
            <div className="col-span-1 md:col-span-2">
              <InputField 
                label="Description" 
                value={newItem.description} 
                onChange={e => setNewItem({...newItem, description: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1 ml-1">Category</label>
              <select 
                className="w-full bg-slate-900/50 border border-purple-500/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
              >
                <option value="Main">Main Course</option>
                <option value="Side">Side Dish</option>
                <option value="Drink">Drink</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-purple-200 mb-1 ml-1">Emoji Icon</label>
               <input 
                  type="text" 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  value={newItem.image}
                  onChange={e => setNewItem({...newItem, image: e.target.value})}
                  placeholder="e.g. 🍔"
               />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit">Save Item</Button>
          </div>
        </form>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 rounded-lg bg-black/30 flex items-center justify-center text-3xl shrink-0">
              {item.image}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold truncate">{item.name}</h3>
              <p className="text-pink-400">${item.price.toFixed(2)}</p>
              <p className="text-xs text-purple-300/50 truncate">{item.category}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onUpdateMenuStatus(item.id, !item.available)}
                className={`flex flex-col items-center gap-1 transition-colors ${item.available ? 'text-green-400' : 'text-gray-500'}`}
                title="Toggle Availability"
              >
                {item.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => onDeleteMenuItem(item.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
                title="Delete Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
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
    const deliveryOrders = orders.filter(o => o.status === OrderStatus.READY || o.status === OrderStatus.DELIVERED);
    // Sort to show Ready orders first
    deliveryOrders.sort((a, b) => (a.status === OrderStatus.READY ? -1 : 1));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryOrders.length === 0 && (
          <div className="col-span-full text-center text-purple-300/40 py-12">
            <Truck className="w-16 h-16 mx-auto mb-4" />
            <p>No orders ready for delivery.</p>
          </div>
        )}
        {deliveryOrders.map(order => (
          <div key={order.id} className={`bg-white/5 border ${order.status === OrderStatus.DELIVERED ? 'border-purple-500/20 opacity-70' : 'border-white/10'} rounded-xl overflow-hidden flex flex-col`}>
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
              <div className="text-sm text-purple-300 mt-2">
                 <p>{order.items.length} items</p>
                 <p className="text-xs text-purple-300/50 mt-1 truncate">
                   {order.items.map(i => i.name).join(', ')}
                 </p>
              </div>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              {order.status === OrderStatus.READY ? (
                 <Button fullWidth variant="primary" onClick={() => onUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}>
                  Mark Delivered
                </Button>
              ) : (
                <div className="text-center text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" /> Delivered Successfully
                </div>
              )}
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
          <UtensilsCrossed className="w-5 h-5" /> Manager
        </button>
        <button 
          onClick={() => setActiveTab(AdminTab.KITCHEN)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
            activeTab === AdminTab.KITCHEN 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          <ChefHat className="w-5 h-5" /> Kitchen
        </button>
        <button 
          onClick={() => setActiveTab(AdminTab.DELIVERY)}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
            activeTab === AdminTab.DELIVERY 
            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
            : 'bg-white/5 text-purple-300 hover:bg-white/10'
          }`}
        >
          <Truck className="w-5 h-5" /> Delivery
        </button>
      </div>

      {/* Content Area */}
      <div className="animation-fade-in">
        {activeTab === AdminTab.MANAGER && renderManagerView()}
        {activeTab === AdminTab.KITCHEN && renderKitchenView()}
        {activeTab === AdminTab.DELIVERY && renderDeliveryView()}
      </div>
    </div>
  );
};