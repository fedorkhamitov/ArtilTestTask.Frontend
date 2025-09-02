import React, { forwardRef, ReactNode } from 'react'
import { clsx } from 'clsx'

/**
 * Пропсы компонента Input
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

/**
 * Компонент поля ввода
 * 
 * Универсальный компонент для ввода данных с поддержкой лейблов,
 * сообщений об ошибках, вспомогательного текста и иконок.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const hasError = Boolean(error)
  
  const inputClasses = clsx(
    'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200',
    {
      'border-gray-300 focus:border-primary-500 focus:ring-primary-500': !hasError,
      'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500': hasError,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  )
  
  const containerClasses = clsx(
    'relative',
    fullWidth ? 'w-full' : 'w-auto'
  )

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input