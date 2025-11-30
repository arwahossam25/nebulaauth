import React, { useRef, useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { LogIn, User as UserIcon, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onNavigateSignup: () => void;
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateSignup, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        role: UserRole.CUSTOMER
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
    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animation-fade-in">
      <div className="text-center mb-8">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/30">
          <LogIn className="w-8 h-8 text-white" />
        </div> */}
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
          🍽️ Welcome to our Restaurant!🍽️
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

        <InputField
          label="Username"
          placeholder="Enter your username"
          icon={<UserIcon className="w-5 h-5" />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          autoFocus
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
            {isLoading ? 'Signing In...' : 'Sign In'}
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