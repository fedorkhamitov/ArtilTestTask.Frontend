import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RegisterRequest } from '@/types/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

/**
 * Пропсы компонента RegisterForm
 */
interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => Promise<void>
  isLoading: boolean
}

/**
 * Форма регистрации нового пользователя
 * 
 * Предоставляет поля для создания новой учетной записи с валидацией.
 */
const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterRequest & { confirmPassword: string }>()

  const password = watch('password')

  const handleFormSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data
    onSubmit(registerData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Input
          label="Имя пользователя"
          type="text"
          autoComplete="username"
          placeholder="Выберите имя пользователя"
          error={errors.username?.message}
          {...register('username', {
            required: 'Имя пользователя обязательно',
            minLength: {
              value: 3,
              message: 'Имя пользователя должно содержать минимум 3 символа'
            },
            maxLength: {
              value: 50,
              message: 'Имя пользователя не может превышать 50 символов'
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Имя пользователя может содержать только буквы, цифры и подчеркивания'
            }
          })}
        />
      </div>

      <div>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Введите email адрес"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email обязателен',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Введите корректный email адрес'
            }
          })}
        />
      </div>

      <div>
        <Input
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Создайте пароль"
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
            },
            maxLength: {
              value: 100,
              message: 'Пароль не может превышать 100 символов'
            }
          })}
        />
      </div>

      <div>
        <Input
          label="Подтверждение пароля"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Повторите пароль"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Подтверждение пароля обязательно',
            validate: value => value === password || 'Пароли не совпадают'
          })}
        />
      </div>

      <div className="text-sm text-gray-600">
        <p>Требования к паролю:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Минимум 6 символов</li>
          <li>Рекомендуется использовать буквы, цифры и специальные символы</li>
        </ul>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Зарегистрироваться
      </Button>
    </form>
  )
}

export default RegisterForm