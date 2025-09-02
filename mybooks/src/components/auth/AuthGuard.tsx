import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types/auth'

/**
 * Пропсы компонента AuthGuard
 */
interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  fallbackPath?: string
}

/**
 * Компонент защиты маршрутов
 * 
 * Проверяет авторизацию пользователя и его роль.
 * Перенаправляет неавторизованных пользователей на страницу входа,
 * а пользователей без достаточных прав на главную страницу.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Если требуется аутентификация, но пользователь гость
  if (requiredRoles.length > 0 && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Проверяем роль пользователя
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/books" replace />
  }

  // Пользователь авторизован и имеет необходимые права
  return <>{children}</>
}

export default AuthGuard