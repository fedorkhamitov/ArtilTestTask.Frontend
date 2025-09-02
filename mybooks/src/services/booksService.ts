import { api } from './api'
import { 
  Book, 
  BookQueryParameters, 
  BookQueryResult, 
  CreateBookRequest, 
  UpdateBookRequest, 
  BookFilters
} from '@/types/book'
import { ApiResponse } from '@/types/api'

class BooksService {
  private baseUrl = '/api/books'

  /**
   * Получение списка книг с фильтрацией и пагинацией
   */
  async getBooks(params: BookQueryParameters): Promise<BookQueryResult> {
    try {
      const queryParams = new URLSearchParams()

      // Пагинация
      queryParams.append('pagination.page', params.pagination.page.toString())
      queryParams.append('pagination.pageSize', params.pagination.pageSize.toString())

      // Фильтры (добавляем только заполненные)
      if (params.filters.searchTerm) {
        queryParams.append('filters.searchTerm', params.filters.searchTerm)
      }
      if (params.filters.author) {
        queryParams.append('filters.author', params.filters.author)
      }
      if (params.filters.genre) {
        queryParams.append('filters.genre', params.filters.genre)
      }
      if (params.filters.publishingHouse) {
        queryParams.append('filters.publishingHouse', params.filters.publishingHouse)
      }
      if (params.filters.yearFrom) {
        queryParams.append('filters.yearFrom', params.filters.yearFrom.toString())
      }
      if (params.filters.yearTo) {
        queryParams.append('filters.yearTo', params.filters.yearTo.toString())
      }

      // Сортировка
      if (params.sorting.sortBy) {
        queryParams.append('sorting.sortBy', params.sorting.sortBy)
      }
      if (params.sorting.direction) {
        queryParams.append('sorting.direction', params.sorting.direction)
      }

      const response = await api.get<ApiResponse<BookQueryResult>>(
        `${this.baseUrl}?${queryParams.toString()}`
      )

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Ошибка получения книг')
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  }

  /**
   * Получение книги по ID
   */
  async getBookById(id: string): Promise<Book> {
    try {
      const response = await api.get<ApiResponse<Book>>(`${this.baseUrl}/${id}`)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Книга не найдена')
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  }

  /**
   * Создание новой книги
   */
  async createBook(bookData: CreateBookRequest): Promise<Book> {
    try {
      const response = await api.post<ApiResponse<Book>>(this.baseUrl, bookData)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Ошибка создания книги')
      }

      return response.data.data
    } catch (error) {
      console.error('Error creating book:', error)
      throw error
    }
  }

  /**
   * Обновление книги
   */
  async updateBook(id: string, bookData: UpdateBookRequest): Promise<Book> {
    try {
      const response = await api.put<ApiResponse<Book>>(`${this.baseUrl}/${id}`, bookData)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Ошибка обновления книги')
      }

      return response.data.data
    } catch (error) {
      console.error('Error updating book:', error)
      throw error
    }
  }

  /**
   * Удаление книги
   */
  async deleteBook(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`)

      if (!response.data.success) {
        throw new Error(response.data.message || 'Ошибка удаления книги')
      }

      return response.data.data || true
    } catch (error) {
      console.error('Error deleting book:', error)
      throw error
    }
  }

  /**
   * Экспорт в CSV
   */
  async exportToCSV(params: BookQueryParameters): Promise<void> {
    try {
      const queryParams = new URLSearchParams()

      // Фильтры (добавляем только заполненные)
      if (params.filters.searchTerm) {
        queryParams.append('filters.searchTerm', params.filters.searchTerm)
      }
      if (params.filters.author) {
        queryParams.append('filters.author', params.filters.author)
      }
      if (params.filters.genre) {
        queryParams.append('filters.genre', params.filters.genre)
      }
      if (params.filters.publishingHouse) {
        queryParams.append('filters.publishingHouse', params.filters.publishingHouse)
      }
      if (params.filters.yearFrom) {
        queryParams.append('filters.yearFrom', params.filters.yearFrom.toString())
      }
      if (params.filters.yearTo) {
        queryParams.append('filters.yearTo', params.filters.yearTo.toString())
      }

      // Сортировка
      if (params.sorting.sortBy) {
        queryParams.append('sorting.sortBy', params.sorting.sortBy)
      }
      if (params.sorting.direction) {
        queryParams.append('sorting.direction', params.sorting.direction)
      }

      const response = await api.get(
        `${this.baseUrl}/export/csv?${queryParams.toString()}`,
        {
          responseType: 'blob'
        }
      )

      // Создаем и скачиваем файл
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `books_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error exporting books:', error)
      throw error
    }
  }

  /**
   * Получение списка жанров
   */
  async getGenres(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>(`${this.baseUrl}/genres`)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Ошибка получения жанров')
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching genres:', error)
      // Возвращаем заглушку, если не получилось загрузить
      return ['Фантастика', 'Детектив', 'Роман', 'Поэзия', 'Классическая литература']
    }
  }

  /**
   * Получение количества книг
   */
  async getBooksCount(filters: BookFilters): Promise<number> {
    try {
      const queryParams = new URLSearchParams()

      // Фильтры (добавляем только заполненные)
      if (filters.searchTerm) {
        queryParams.append('searchTerm', filters.searchTerm)
      }
      if (filters.author) {
        queryParams.append('author', filters.author)
      }
      if (filters.genre) {
        queryParams.append('genre', filters.genre)
      }
      if (filters.publishingHouse) {
        queryParams.append('publishingHouse', filters.publishingHouse)
      }
      if (filters.yearFrom) {
        queryParams.append('yearFrom', filters.yearFrom.toString())
      }
      if (filters.yearTo) {
        queryParams.append('yearTo', filters.yearTo.toString())
      }

      const response = await api.get<ApiResponse<number>>(
        `${this.baseUrl}/count?${queryParams.toString()}`
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'Ошибка получения количества книг')
      }

      return response.data.data || 0
    } catch (error) {
      console.error('Error fetching books count:', error)
      throw error
    }
  }
}

export const booksService = new BooksService()