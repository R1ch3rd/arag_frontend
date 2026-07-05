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
  const baseStyles = 'font-medium rounded-md transition-colors duration-200'

  const variants = {
    primary: 'bg-accent-btn text-white hover:bg-accent',
    secondary: 'bg-surface-warm text-ink border border-surface-border hover:border-accent',
    ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-cream-deep',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
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
