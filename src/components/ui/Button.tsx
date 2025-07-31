// src/components/ui/Button.tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
  }
  
const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
  className = '',
    ...props
  }: ButtonProps) => {
    const baseStyles = 'font-medium rounded-lg transition-colors duration-200'
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      ghost: 'bg-transparent hover:bg-gray-100'
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }
  
    return (
      <button
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    )
  }

export { Button }
  
  // src/components/ui/Input.tsx
  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
  }
  
const Input = ({ label, error, className, ...props }: InputProps) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }

export { Input }
  
  // src/components/ui/Card.tsx
  interface CardProps {
    children: React.ReactNode
    className?: string
  }
  
const Card = ({ children, className }: CardProps) => {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        {children}
      </div>
    )
  }
  
export { Card }
