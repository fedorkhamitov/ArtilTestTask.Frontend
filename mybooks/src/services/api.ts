import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiError, ApiResponse } from '@/types/api'

/**
 * Базовый URL API бэкенда
 */
const API_BASE_URL = 'http://localhost:5000'

/**
 * Создание экземпляра Axios с базовыми настройками
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Добавляем JWT токен к каждому запросу
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Обработка ответов и ошибок
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse>) => {
      // Автоматический логаут при 401 ошибке
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }

      // Преобразуем ошибку в стандартный формат
      const apiError: ApiError = {
        code: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'Произошла неизвестная ошибка',
        errors: error.response?.data?.errors || undefined,
      }

      return Promise.reject(apiError)
    }
  )

  return instance
}

/**
 * Экземпляр API клиента
 */
export const api = createApiInstance()

/**
 * Утилита для скачивания файлов
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  } catch {
    throw new Error('Не удалось скачать файл')
  }
}

export default api