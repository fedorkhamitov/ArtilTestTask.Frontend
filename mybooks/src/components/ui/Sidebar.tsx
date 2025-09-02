import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  BookOpenIcon,
  PlusIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

/**
 * Элемент навигации в сайдбаре
 */
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredRoles?: string[]
  badge?: string
}

/**
 * Сайдбар навигации
 * 
 * Содержит основную навигацию по приложению с учетом ролей пользователя.
 */
const Sidebar: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // Определяем доступные пункты навигации в зависимости от роли
  const navigationItems: NavItem[] = [
    {
      name: 'Библиотека',
      href: '/books',
      icon: BookOpenIcon,
    },
    ...(isAuthenticated ? [
      {
        name: 'Добавить книгу',
        href: '/books/new',
        icon: PlusIcon,
        requiredRoles: ['User', 'Admin'],
      }
    ] : []),
    ...(user?.role === 'Admin' ? [
      {
        name: 'Пользователи',
        href: '/admin/users',
        icon: UsersIcon,
        requiredRoles: ['Admin'],
      }
    ] : []),
  ]

  /**
   * Проверка доступа к пункту меню
   */
  const hasAccess = (item: NavItem): boolean => {
    if (!item.requiredRoles) return true
    if (!user) return false
    return item.requiredRoles.includes(user.role)
  }

  /**
   * Проверка активности пункта меню
   */
  const isActive = (href: string): boolean => {
    if (href === '/books') {
      return location.pathname === '/books' || location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-white shadow-sm h-screen sticky top-0 border-r border-gray-200">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            if (!hasAccess(item)) return null

            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                    {
                      'bg-primary-100 text-primary-900': active,
                      'text-gray-700 hover:text-gray-900 hover:bg-gray-50': !active,
                    }
                  )
                }
              >
                <Icon
                  className={clsx(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150',
                    {
                      'text-primary-600': active,
                      'text-gray-400 group-hover:text-gray-600': !active,
                    }
                  )}
                />
                {item.name}
                {item.badge && (
                  <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Информационный блок для гостей */}
        {!isAuthenticated && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <Cog6ToothIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Режим гостя
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>
                    Для полного доступа войдите в систему или зарегистрируйтесь.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar