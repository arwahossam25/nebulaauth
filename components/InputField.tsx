import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-purple-200 mb-1 ml-1">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400 group-focus-within:text-pink-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-slate-900/50 border border-purple-500/30 rounded-xl 
              py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 
              text-white placeholder-purple-400/50
              focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent
              transition-all duration-300
              ${error ? 'border-red-500/80 ring-1 ring-red-500/50' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400 font-medium animate-pulse ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';