import React, { useRef, useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { LogIn, User as UserIcon, Lock, ArrowRight, AlertCircle, Shield, Smile } from 'lucide-react';

interface LoginProps {
  onNavigateSignup: () => void;
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateSignup, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs for focus management
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Check for empty fields
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock login - in a real app, this would validate against a backend
      onLoginSuccess({
        username: username.trim(),
        email: 'user@example.com',
        role: role
      });
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animation-fade-in my-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
          🍽️ Welcome to our Restaurant! 🍽️
        </h2>
        <p className="text-purple-200/60 mt-2">Please sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-200 mb-2 ml-1">
            Sign in as
          </label>
          <div className="grid grid-cols-2 gap-3">
             <button
              type="button"
              onClick={() => setRole(UserRole.CUSTOMER)}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300
                ${role === UserRole.CUSTOMER 
                  ? 'border-pink-500 bg-pink-500/20 text-white shadow-md shadow-pink-500/10' 
                  : 'border-white/10 bg-white/5 text-purple-300 hover:bg-white/10'}
              `}
            >
              <Smile className="w-4 h-4" />
              <span className="font-semibold text-sm">Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole(UserRole.ADMIN)}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300
                ${role === UserRole.ADMIN 
                  ? 'border-blue-500 bg-blue-500/20 text-white shadow-md shadow-blue-500/10' 
                  : 'border-white/10 bg-white/5 text-purple-300 hover:bg-white/10'}
              `}
            >
              <Shield className="w-4 h-4" />
              <span className="font-semibold text-sm">Admin</span>
            </button>
          </div>
        </div>

        <InputField
          label="Username"
          placeholder="Enter your username"
          icon={<UserIcon className="w-5 h-5" />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          required
        />

        <InputField
          ref={passwordRef}
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-4">
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Signing In...' : `Sign In as ${role === UserRole.CUSTOMER ? 'Customer' : 'Admin'}`}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-purple-200/70 text-sm">
          Don't have an account?{' '}
          <button 
            onClick={onNavigateSignup}
            className="font-semibold text-pink-400 hover:text-pink-300 underline decoration-pink-500/30 hover:decoration-pink-400 transition-all"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};