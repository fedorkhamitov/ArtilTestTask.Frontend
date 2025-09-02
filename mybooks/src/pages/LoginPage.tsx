import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import Button from '@/components/ui/Button'
import { LoginRequest, RegisterRequest } from '@/types/auth'
import { BookOpenIcon, UserPlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

/**
 * Страница аутентификации
 * 
 * Предоставляет возможности входа в систему, регистрации
 * и входа в режиме гостя.
 */
const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { user, login, register, loginAsGuest, isLoading } = useAuth()
  const navigate = useNavigate()

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (user) {
    return <Navigate to="/books" replace />
  }

  /**
   * Обработка входа в систему
   */
  const handleLogin = async (data: LoginRequest) => {
    try {
      await login(data)
      navigate('/books')
    } catch (error) {
      // Ошибка обрабатывается в useAuth через toast
    }
  }

  /**
   * Обработка регистрации
   */
  const handleRegister = async (data: RegisterRequest) => {
    try {
      await register(data)
      navigate('/books')
    } catch (error) {
      // Ошибка обрабатывается в useAuth через toast
    }
  }

  /**
   * Обработка входа как гость
   */
  const handleGuestLogin = () => {
    loginAsGuest()
    navigate('/books')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Система управления библиотекой
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? 'Войдите в свою учетную запись' 
              : 'Создайте новую учетную запись'
            }
          </p>
        </div>

        {/* Переключатель режимов */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Форма аутентификации */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {mode === 'login' ? (
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          )}
        </div>

        {/* Вход как гость */}
        <div className="bg-white py-6 px-6 shadow rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Или войдите как гость
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Просматривайте библиотеку без регистрации
            </p>
            <Button
              variant="outline"
              fullWidth
              onClick={handleGuestLogin}
              leftIcon={<UserPlusIcon className="h-5 w-5" />}
              rightIcon={<ArrowRightIcon className="h-5 w-5" />}
            >
              Войти как гость
            </Button>
          </div>
        </div>

        {/* Информация о возможностях */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Возможности системы:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Просмотр каталога книг (для всех пользователей)</li>
            <li>• Добавление и редактирование книг (для зарегистрированных)</li>
            <li>• Экспорт данных в CSV (для зарегистрированных)</li>
            <li>• Управление пользователями (для администраторов)</li>
          </ul>
        </div>

        {/* Тестовые учетные данные */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">
            Тестовые учетные данные:
          </h4>
          <div className="text-sm text-yellow-800 space-y-1">
            <p><strong>Администратор:</strong> admin / Admin123!</p>
            <p><strong>Пользователь:</strong> user / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage