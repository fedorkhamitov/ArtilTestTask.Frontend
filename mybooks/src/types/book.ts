/**
 * Базовая модель книги (соответствует вашему API)
 */
export interface Book {
  id: string
  title: string
  author: string
  genre: string
  publishingHouse: string
  year: number
  isbn: string
}

/**
 * DTO для создания книги
 */
export interface CreateBookRequest {
  title: string
  author: string
  genre: string
  publishingHouse: string
  year: number
  isbn: string
}

/**
 * DTO для обновления книги
 */
export interface UpdateBookRequest {
  title: string
  author: string
  genre: string
  publishingHouse: string
  year: number
  isbn: string
}

/**
 * Параметры пагинации (соответствует PaginationParameters в бэкенде)
 */
export interface PaginationParameters {
  page: number
  pageSize: number
}

/**
 * Фильтры книг (соответствует BookFilters в бэкенде)
 */
export interface BookFilters {
  searchTerm?: string
  author?: string
  genre?: string
  publishingHouse?: string
  yearFrom?: number
  yearTo?: number
}

/**
 * Параметры сортировки (соответствует SortingParameters в бэкенде)
 */
export interface BookSorting {
  sortBy?: 'Title' | 'Author' | 'Genre' | 'PublishingHouse' | 'Year' | 'ISBN'
  direction?: 'Ascending' | 'Descending'
}

/**
 * Полные параметры запроса книг (соответствует BookQueryParameters в бэкенде)
 */
export interface BookQueryParameters {
  pagination: PaginationParameters
  filters: BookFilters
  sorting: BookSorting
}

/**
 * Результат запроса книг (соответствует data в ApiResponse от вашего бэкенда)
 */
export interface BookQueryResult {
  books: Book[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Настройки видимости колонок
 */
export interface ColumnVisibility {
  title: boolean
  author: boolean
  genre: boolean
  publishingHouse: boolean
  year: boolean
  isbn: boolean
}