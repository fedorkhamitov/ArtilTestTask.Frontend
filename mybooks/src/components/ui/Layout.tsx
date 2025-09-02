import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Header from './Header'
import Sidebar from './Sidebar'

/**
 * Основной лейаут приложения
 * 
 * Предоставляет общую структуру страницы с навигацией,
 * сайдбаром и областью для основного контента.
 */
const Layout: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return null // Навигация будет обработана в App.tsx
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка приложения */}
      <Header />
      
      <div className="flex">
        {/* Сайдбар навигации */}
        <Sidebar />
        
        {/* Основная область контента */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Хлебные крошки */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Главная</span>
                {location.pathname !== '/' && (
                  <>
                    <span>/</span>
                    <span className="text-gray-900">
                      {getPageTitle(location.pathname)}
                    </span>
                  </>
                )}
              </div>
            </nav>
            
            {/* Область для контента страницы */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

/**
 * Получение заголовка страницы по пути
 */
function getPageTitle(pathname: string): string {
  const pathMap: Record<string, string> = {
    '/books': 'Библиотека',
    '/books/new': 'Добавить книгу',
    '/admin/users': 'Управление пользователями',
  }
  
  // Для динамических путей
  if (pathname.includes('/books/') && pathname.includes('/edit')) {
    return 'Редактировать книгу'
  }
  
  if (pathname.includes('/books/') && !pathname.includes('/edit') && !pathname.includes('/new')) {
    return 'Детали книги'
  }
  
  return pathMap[pathname] || 'Страница'
}

export default Layout