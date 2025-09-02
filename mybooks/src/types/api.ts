/**
 * Стандартная структура ошибки API
 */
export interface ApiError {
  code: number
  message: string
  errors?: string[]
}

/**
 * Стандартная структура ответа API (соответствует вашему бэкенду)
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number
  pageSize: number
}