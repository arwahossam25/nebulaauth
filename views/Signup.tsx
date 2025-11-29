import React, { useRef, useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { UserPlus, User as UserIcon, Mail, Lock, Shield, Smile } from 'lucide-react';

interface SignupProps {
  onNavigateLogin: () => void;
  onSignupSuccess: (user: User) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigateLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: UserRole.CUSTOMER
  });
  
  const [errors, setErrors] = useState({
    email: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Refs for navigation
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      return "Must use a valid email address containing '@'";
    }
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for email
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement> | null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignupSuccess({
        username: formData.username,
        email: formData.email,
        role: formData.role
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animation-fade-in my-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
          Create Account
        </h2>
        <p className="text-purple-200/60 mt-2">Join us today!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-purple-200 mb-3 ml-1">
            What role would you like to register as?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleRoleSelect(UserRole.CUSTOMER)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300
                ${formData.role === UserRole.CUSTOMER 
                  ? 'border-pink-500 bg-pink-500/20 text-white shadow-lg shadow-pink-500/20' 
                  : 'border-white/10 bg-white/5 text-purple-300 hover:bg-white/10 hover:border-white/30'}
              `}
            >
              <Smile className={`w-8 h-8 mb-2 ${formData.role === UserRole.CUSTOMER ? 'text-pink-400' : 'text-purple-400'}`} />
              <span className="font-semibold">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect(UserRole.ADMIN)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300
                ${formData.role === UserRole.ADMIN 
                  ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20' 
                  : 'border-white/10 bg-white/5 text-purple-300 hover:bg-white/10 hover:border-white/30'}
              `}
            >
              <Shield className={`w-8 h-8 mb-2 ${formData.role === UserRole.ADMIN ? 'text-blue-400' : 'text-purple-400'}`} />
              <span className="font-semibold">Admin</span>
            </button>
          </div>
        </div>

        <InputField
          label="Username"
          placeholder="Choose a username"
          icon={<UserIcon className="w-5 h-5" />}
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
          required
        />

        <InputField
          ref={emailRef}
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          error={errors.email}
          required
        />

        <InputField
          ref={passwordRef}
          label="Create Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
        />

        <div className="pt-2">
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-purple-200/70 text-sm">
          Do you have an account already?{' '}
          <button 
            onClick={onNavigateLogin}
            className="font-semibold text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-400 transition-all"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};