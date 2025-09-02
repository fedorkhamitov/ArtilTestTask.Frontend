/**
 * Типы для аутентификации и авторизации
 */

/**
 * Роли пользователей в системе
 */
export type UserRole = 'Guest' | 'User' | 'Admin'

/**
 * Данные пользователя
 */
export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

/**
 * Запрос на авторизацию
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * Запрос на регистрацию
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

/**
 * Ответ после успешной аутентификации
 */
export interface AuthResponse {
  token: string
  expiresAt: string
  user: User
}

/**
 * Контекст аутентификации
 */
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  loginAsGuest: () => void
  logout: () => void
}