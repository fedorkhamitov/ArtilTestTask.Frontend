import { useAuthContext } from '@/context/AuthContext'

/**
 * Хук для работы с аутентификацией
 * 
 * Простая обертка над AuthContext для удобства использования
 */
export const useAuth = () => {
  return useAuthContext()
}