import { api } from './api'
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'
import { ApiResponse } from '@/types/api'

/**
 * Сервис для работы с аутентификацией и авторизацией
 * 
 * Предоставляет методы для входа в систему, регистрации
 * и управления состоянием аутентификации пользователя.
 */
class AuthService {
  /**
   * Вход пользователя в систему
   * 
   * @param credentials - Учетные данные пользователя
   * @returns Данные аутентификации с JWT токеном
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Ошибка аутентификации')
    }

    const authData = response.data.data
    
    // Сохраняем токен и данные пользователя в localStorage
    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('auth_user', JSON.stringify(authData.user))
    
    return authData
  }

  /**
   * Регистрация нового пользователя
   * 
   * @param userData - Данные для регистрации
   * @returns Данные аутентификации с JWT токеном
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', userData)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Ошибка регистрации')
    }

    const authData = response.data.data
    
    // Сохраняем токен и данные пользователя в localStorage
    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('auth_user', JSON.stringify(authData.user))
    
    return authData
  }

  /**
   * Выход из системы
   * 
   * Удаляет все данные аутентификации из локального хранилища.
   */
  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  /**
   * Получение текущего JWT токена
   * 
   * @returns JWT токен или null, если пользователь не авторизован
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  /**
   * Получение данных текущего пользователя из localStorage
   * 
   * @returns Объект пользователя или null, если не авторизован
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Проверка авторизации пользователя
   * 
   * @returns true, если пользователь авторизован
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  /**
   * Проверка истечения срока действия токена
   * 
   * @returns true, если токен истек
   */
  isTokenExpired(): boolean {
    // Простая проверка на основе localStorage
    // В реальном приложении можно добавить декодирование JWT
    const token = this.getToken()
    const user = this.getCurrentUser()
    
    if (!token || !user) return true
    
    // Дополнительная проверка может быть добавлена здесь
    return false
  }
}

/**
 * Экспортируем единственный экземпляр сервиса
 */
export const authService = new AuthService()
export default authService