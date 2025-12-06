import React, { useState } from 'react';
import { User as UserType, MenuItem, CartItem, Order, OrderStatus } from '../types';
import { Button } from '../components/Button';
import { LogOut, ShoppingBag, X, AlertCircle, CheckCircle2, PackageSearch, Clock, Send, Mail, MessageSquare, User, CreditCard, Banknote } from 'lucide-react';

interface CustomerDashboardProps {
  user: UserType;
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
  
  // Changed from isOrdersOpen to a view state to manage pages
  const [currentView, setCurrentView] = useState<'home' | 'orders' | 'contact'>('home');
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

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
    // Basic validation for card
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        alert("Please fill in all card details.");
        return;
      }
    }

    setIsProcessingPayment(true);
    setPaymentStatus('idle');

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate Payment Error (Extend Use Case) - 30% chance of failure
    const isSuccess = Math.random() > 0.1; // Reduced failure rate for better UX in demo

    if (isSuccess) {
      setPaymentStatus('success');
      onPlaceOrder(cart, cartTotal);
      setTimeout(() => {
        setCart([]);
        setCardDetails({ number: '', expiry: '', cvc: '' });
        setIsCartOpen(false);
        setPaymentStatus('idle');
        setCurrentView('orders'); // Redirect to Orders page on success
      }, 2000);
    } else {
      setPaymentStatus('error');
    }
    setIsProcessingPayment(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent!\nName: ${contactForm.name}\nEmail: ${contactForm.email}\nMessage: ${contactForm.message}`);
    setContactForm({ name: '', email: '', message: '' });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: 
      case OrderStatus.PREPARING:
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
            <Button 
              onClick={() => setCurrentView('home')} 
              variant={currentView === 'home' ? 'primary' : 'outline'} 
              className="!py-1.5 !px-3 !text-sm border-transparent"
            >
              Home
            </Button>
            <Button 
              onClick={() => setCurrentView('orders')} 
              variant={currentView === 'orders' ? 'primary' : 'outline'} 
              className="!py-1.5 !px-3 !text-sm border-transparent"
            >
              My Orders
            </Button>
            <Button 
              onClick={() => setCurrentView('contact')} 
              variant={currentView === 'contact' ? 'primary' : 'outline'} 
              className="!py-1.5 !px-3 !text-sm border-transparent"
            >
              Contact
            </Button>
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-4">
        
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="animation-fade-in">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Our Menu</h2>
                <p className="text-purple-200/60">Delicious cosmic delights, freshly prepared.</p>
              </div>
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
        )}

        {/* ORDERS VIEW */}
        {currentView === 'orders' && (
          <div className="animation-fade-in max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <PackageSearch className="w-8 h-8 text-blue-400" />
              My Orders
            </h2>
            <p className="text-purple-200/60 mb-8">Track your delivery status in real-time.</p>

            <div className="bg-[#1a1640] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 overflow-x-auto">
                {myOrders.length === 0 ? (
                  <div className="text-center py-16 text-purple-300/50 flex flex-col items-center">
                    <PackageSearch className="w-16 h-16 opacity-30 mb-4" />
                    <p className="text-lg">No past orders found.</p>
                    <Button onClick={() => setCurrentView('home')} variant="outline" className="mt-4">Start Ordering</Button>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm text-purple-200">
                    <thead className="bg-white/5 text-purple-100 uppercase font-bold text-xs">
                      <tr>
                        <th className="p-4 rounded-l-lg">ID</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 rounded-r-lg text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {myOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-pink-300">#{order.id.slice(-4)}</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              {order.items.map((item, i) => (
                                <span key={i} className="truncate flex items-center gap-2">
                                  <span className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-xs font-bold">{item.quantity}</span> 
                                  {item.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-4 text-right font-bold text-white">
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT VIEW */}
        {currentView === 'contact' && (
          <div className="animation-fade-in max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <MessageSquare className="w-8 h-8 text-pink-400" />
                Contact Us
              </h2>
              <p className="text-purple-200/60">Have an issue with your order? Send us a message.</p>
            </div>

            <div className="bg-[#1a1640] border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-purple-200 text-sm font-bold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" /> Your Name
                  </label>
                  <input 
                    type="text" 
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none transition-colors focus:bg-white/5"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-bold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none transition-colors focus:bg-white/5"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-bold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" /> Message
                  </label>
                  <textarea 
                    rows={5}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none transition-colors focus:bg-white/5 resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>
                <Button fullWidth type="submit" className="!py-3 !text-base">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#1a1640] border-l border-white/10 shadow-2xl flex flex-col h-full animation-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#130f2e]">
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
                  <Button variant="outline" onClick={() => setIsCartOpen(false)}>Browse Menu</Button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 flex gap-4 items-center border border-white/5 hover:border-white/10 transition-colors">
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
            
            {/* Footer with Payment Logic */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#130f2e] border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold text-white mb-2">
                  <span>Total</span>
                  <span className="text-pink-400">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-purple-200">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`
                        flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300
                        ${paymentMethod === 'card' 
                          ? 'border-pink-500 bg-pink-500/20 text-white shadow-md shadow-pink-500/10' 
                          : 'border-white/10 bg-white/5 text-purple-300 hover:bg-white/10 hover:border-white/30'}
                      `}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold text-sm">Visa Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`
                        flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300
                        ${paymentMethod === 'cash' 
                          ? 'border-green-500 bg-green-500/20 text-white shadow-md shadow-green-500/10' 
                          : 'border-white/10 bg-white/5 text-purple-300 hover:bg-white/10 hover:border-white/30'}
                      `}
                    >
                      <Banknote className="w-4 h-4" />
                      <span className="font-semibold text-sm">Cash</span>
                    </button>
                  </div>
                </div>

                {/* Card Details Inputs */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10 animate-fade-in">
                    <input 
                      type="text"
                      placeholder="Card Number"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-pink-500 focus:outline-none"
                      value={cardDetails.number}
                      onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                      maxLength={19}
                    />
                    <div className="flex gap-3">
                       <input 
                        type="text"
                        placeholder="MM/YY"
                        className="w-1/2 bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-pink-500 focus:outline-none"
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                        maxLength={5}
                      />
                       <input 
                        type="text"
                        placeholder="CVC"
                        className="w-1/2 bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-pink-500 focus:outline-none"
                        value={cardDetails.cvc}
                        onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                        maxLength={3}
                      />
                    </div>
                  </div>
                )}
                
                {/* Cash Message */}
                {paymentMethod === 'cash' && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm text-center animate-fade-in flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Payment will be collected upon delivery.
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Payment Failed. Please try again.
                  </div>
                )}
                
                <Button fullWidth onClick={handlePayment} disabled={isProcessingPayment || paymentStatus === 'success'}>
                  {isProcessingPayment ? 'Processing...' : (paymentMethod === 'card' ? 'Pay Now' : 'Place Order')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};