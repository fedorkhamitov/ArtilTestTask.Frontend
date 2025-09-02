import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, RegisterRequest, AuthContextType } from '@/types/auth'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

/**
 * Контекст аутентификации
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Провайдер контекста аутентификации
 * 
 * Управляет состоянием аутентификации пользователя в приложении.
 * Предоставляет методы для входа, выхода, регистрации и проверки статуса авторизации.
 */
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Проверяем состояние аутентификации при загрузке приложения
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated() && !authService.isTokenExpired()) {
          const currentUser = authService.getCurrentUser()
          setUser(currentUser)
        } else {
          // Токен истек или отсутствует - очищаем данные
          authService.logout()
          setUser(null)
        }
      } catch (error) {
        console.error('Ошибка инициализации аутентификации:', error)
        authService.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * Аутентификация пользователя
   * 
   * @param credentials - Учетные данные пользователя
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true)
      const authData = await authService.login(credentials)
      setUser(authData.user)
      toast.success(`Добро пожаловать, ${authData.user.username}!`)
    } catch (error: any) {
      console.error('Ошибка входа:', error)
      toast.error(error.message || 'Ошибка входа в систему')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Регистрация нового пользователя
   * 
   * @param userData - Данные для регистрации
   */
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true)
      const authData = await authService.register(userData)
      setUser(authData.user)
      toast.success(`Регистрация успешна! Добро пожаловать, ${authData.user.username}!`)
    } catch (error: any) {
      console.error('Ошибка регистрации:', error)
      toast.error(error.message || 'Ошибка регистрации')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Вход в режиме гостя
   * 
   * Создает временного пользователя-гостя без сохранения в localStorage.
   */
  const loginAsGuest = (): void => {
    const guestUser: User = {
      id: 'guest',
      username: 'Гость',
      email: '',
      role: 'Guest',
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    setUser(guestUser)
    toast.success('Добро пожаловать в режиме гостя!')
  }

  /**
   * Выход из системы
   * 
   * Очищает данные аутентификации и перенаправляет на страницу входа.
   */
  const logout = (): void => {
    authService.logout()
    setUser(null)
    toast.success('Вы успешно вышли из системы')
  }

  /**
   * Проверка авторизации пользователя
   */
  const isAuthenticated = Boolean(user && user.role !== 'Guest')

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    loginAsGuest,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

/**
 * Хук для использования контекста аутентификации
 * 
 * @returns Объект с данными и методами аутентификации
 * @throws Error если хук используется вне AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext должен использоваться внутри AuthProvider')
  }
  
  return context
}

export default AuthContext