import React, { useState } from 'react';
import { User, MenuItem, CartItem, Order, OrderStatus } from '../types';
import { Button } from '../components/Button';
import { LogOut, ShoppingBag, X, AlertCircle, CheckCircle2, PackageSearch, Clock } from 'lucide-react';

interface CustomerDashboardProps {
  user: User;
  menuItems: MenuItem[];
  orders: Order[]; // Received all orders, will filter by user
  onLogout: () => void;
  onPlaceOrder: (items: CartItem[], total: number) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  user, 
  menuItems,
  orders, 
  onLogout,
  onPlaceOrder
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Filter orders for this customer
  const myOrders = orders.filter(o => o.customerName === user.username);
  // Sort by date desc
  myOrders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setPaymentStatus('idle');

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate Payment Error (Extend Use Case) - 30% chance of failure
    const isSuccess = Math.random() > 0.3;

    if (isSuccess) {
      setPaymentStatus('success');
      onPlaceOrder(cart, cartTotal);
      setTimeout(() => {
        setCart([]);
        setIsCartOpen(false);
        setPaymentStatus('idle');
        setIsOrdersOpen(true); // Open orders tracking automatically
      }, 2000);
    } else {
      setPaymentStatus('error');
    }
    setIsProcessingPayment(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: 
      case OrderStatus.PREPARING:
        // User requested: "Pending" until delivered. We show logic states but style them similarly if needed.
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><Clock className="w-3 h-3"/> Pending</span>;
      case OrderStatus.READY:
         return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30"><PackageSearch className="w-3 h-3"/> On Way</span>;
      case OrderStatus.DELIVERED:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30"><CheckCircle2 className="w-3 h-3"/> Delivered</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Top Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#0f0c29]/80 border-b border-white/10 px-6 py-4 flex justify-between items-center rounded-b-2xl mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            Nebula Eats
          </h1>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="!py-1.5 !px-3 !text-sm border-transparent hover:bg-white/5">Home</Button>
            <Button onClick={() => setIsOrdersOpen(true)} variant="outline" className="!py-1.5 !px-3 !text-sm border-purple-500/30 hover:bg-purple-500/10">My Orders</Button>
            <Button variant="outline" className="!py-1.5 !px-3 !text-sm border-transparent hover:bg-white/5">Contact</Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-semibold">{user.username}</p>
            <p className="text-purple-300/60 text-xs">{user.role}</p>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <ShoppingBag className="w-6 h-6 text-pink-300 group-hover:text-white transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full border-2 border-[#0f0c29]">
                {cartItemCount}
              </span>
            )}
          </button>

          <Button variant="secondary" onClick={onLogout} className="!py-2 !px-3">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Main Content - Menu */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Our Menu</h2>
            <p className="text-purple-200/60">Delicious cosmic delights, freshly prepared.</p>
          </div>
          <button onClick={() => setIsOrdersOpen(true)} className="md:hidden text-purple-300 underline">Track Orders</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-6xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">{item.image}</span>
                {!item.available && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="px-4 py-1 border-2 border-red-500 text-red-500 font-bold tracking-widest uppercase transform -rotate-12 rounded-lg bg-black/50">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <span className="text-pink-400 font-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-purple-200/50 text-sm mb-4 line-clamp-2">{item.description}</p>
                <Button 
                  fullWidth 
                  variant={item.available ? "primary" : "outline"}
                  disabled={!item.available}
                  onClick={() => addToCart(item)}
                  className={!item.available ? "!opacity-50 !cursor-not-allowed !border-red-500/30 !text-red-400" : ""}
                >
                  {item.available ? "Add to Cart" : "Unavailable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#1a1640] border-l border-white/10 shadow-2xl flex flex-col h-full animation-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-400" />
                Your Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-purple-300 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-purple-300/40 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-50" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-black/30 flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{item.name}</h4>
                      <p className="text-pink-400">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white">-</button>
                      <span className="text-white text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 bg-black/20 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-pink-400">${cartTotal.toFixed(2)}</span>
                </div>
                {paymentStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Payment Failed.
                  </div>
                )}
                <Button fullWidth onClick={handlePayment} disabled={isProcessingPayment || paymentStatus === 'success'}>
                  {isProcessingPayment ? 'Processing...' : 'Make Payment'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOrdersOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#1a1640] border border-white/10 shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animation-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-blue-400" />
                My Order Tracking
              </h2>
              <button onClick={() => setIsOrdersOpen(false)} className="text-purple-300 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {myOrders.length === 0 ? (
                <div className="text-center py-10 text-purple-300/50">
                  <p>No past orders found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-purple-200">
                    <thead className="bg-white/5 text-purple-100 uppercase font-bold text-xs">
                      <tr>
                        <th className="p-3 rounded-l-lg">ID</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-lg text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {myOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono text-pink-300">#{order.id.slice(-4)}</td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              {order.items.map((item, i) => (
                                <span key={i} className="truncate">{item.quantity}x {item.name}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-3 text-right font-bold text-white">
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};