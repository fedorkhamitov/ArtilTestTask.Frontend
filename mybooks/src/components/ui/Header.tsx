import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Button from './Button'

/**
 * Шапка приложения
 * 
 * Содержит логотип, информацию о пользователе и кнопку выхода.
 */
const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Логотип и название */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                📚 Система управления библиотекой
              </h1>
            </div>
          </div>

          {/* Информация о пользователе и действия */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Информация о пользователе */}
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {user.username}
                    </span>
                    {isAuthenticated && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {user.role === 'Admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    )}
                    {!isAuthenticated && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Гость
                      </span>
                    )}
                  </div>
                </div>

                {/* Кнопка выхода */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                >
                  Выйти
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header