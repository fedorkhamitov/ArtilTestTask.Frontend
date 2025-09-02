import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoginRequest } from '@/types/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

/**
 * Пропсы компонента LoginForm
 */
interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>
  isLoading: boolean
}

/**
 * Форма входа в систему
 * 
 * Предоставляет поля для ввода логина и пароля с валидацией.
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginRequest>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          label="Имя пользователя"
          type="text"
          autoComplete="username"
          placeholder="Введите имя пользователя"
          error={errors.username?.message}
          {...register('username', {
            required: 'Имя пользователя обязательно',
            minLength: {
              value: 3,
              message: 'Имя пользователя должно содержать минимум 3 символа'
            }
          })}
        />
      </div>

      <div>
        <Input
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Введите пароль"
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: {
              value: 6,
              message: 'Пароль должен содержать минимум 6 символов'
            }
          })}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Войти
      </Button>
    </form>
  )
}

export default LoginForm