'use client'

// src/components/ui/Button.tsx
import React from 'react'
import { cn } from '@/utils/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default',
    disabled,
    children,
    ...props
  }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700",
          variant === 'outline' && "border border-gray-200 bg-transparent hover:bg-gray-100",
          variant === 'ghost' && "bg-transparent hover:bg-gray-100",
          size === 'default' && "h-10 px-4 py-2",
          size === 'sm' && "h-8 px-3",
          size === 'lg' && "h-12 px-8",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }