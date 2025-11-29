import React, { useState } from 'react';
import { User, ViewState, MenuItem, Order, OrderStatus, UserRole, CartItem } from './types';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { Home } from './views/Home';

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Nebula Burger', price: 12.99, description: 'Double beef patty with cosmic sauce and stardust cheese.', image: '🍔', category: 'Main', available: true },
  { id: '2', name: 'Galaxy Pizza', price: 15.50, description: 'Pepperoni, mushrooms, and olives arranged in a spiral galaxy.', image: '🍕', category: 'Main', available: true },
  { id: '3', name: 'Asteroid Fries', price: 5.99, description: 'Crispy potato chunks seasoned with meteor dust (spicy).', image: '🍟', category: 'Side', available: true },
  { id: '4', name: 'Void Shake', price: 6.50, description: 'Blackberry and charcoal vanilla shake. Dark as the void.', image: '🥤', category: 'Drink', available: false },
  { id: '5', name: 'Lunar Salad', price: 9.99, description: 'Fresh greens, goat cheese craters, and balsamic glaze.', image: '🥗', category: 'Side', available: true },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // "Database" State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView(ViewState.HOME);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(ViewState.LOGIN);
  };

  // Admin Actions
  const handleUpdateMenuStatus = (itemId: string, available: boolean) => {
    setMenuItems(prev => prev.map(item => item.id === itemId ? { ...item, available } : item));
  };
//modified part
  

  const handleAddMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };
//modified part end

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  };

  // Customer Actions
  const handlePlaceOrder = (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: currentUser?.username || 'Guest',
      items: items,
      total: total,
      status: OrderStatus.PENDING,
      timestamp: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  // Background style to match the pink/blue/purple requirement
  const backgroundStyle = "min-h-screen w-full bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden";
  
  // Decorative blobs
  const Blobs = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );

  const renderContent = () => {
    if (currentUser && currentView === ViewState.HOME) {
      return (
        <Home 
          user={currentUser} 
          onLogout={handleLogout}
          menuItems={menuItems}
          orders={orders}
          onUpdateMenuStatus={handleUpdateMenuStatus}
          onAddMenuItem={handleAddMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onPlaceOrder={handlePlaceOrder}
        />
      );
    }

    if (currentView === ViewState.SIGNUP) {
      return (
        <Signup 
          onNavigateLogin={() => setCurrentView(ViewState.LOGIN)} 
          onSignupSuccess={handleLoginSuccess}
        />
      );
    }

    return (
      <Login 
        onNavigateSignup={() => setCurrentView(ViewState.SIGNUP)} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  };

  return (
    <div className={backgroundStyle}>
      <Blobs />
      <div className="relative z-10 w-full flex justify-center min-h-full">
        {renderContent()}
      </div>
      
      {/* Tailwind Animation Config Injection */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;