import { useState, useCallback } from 'react'
import { Book, BookQueryParameters, CreateBookRequest, UpdateBookRequest } from '@/types/book'
import { booksService } from '@/services/booksService'
import toast from 'react-hot-toast'

/**
 * Хук для работы с книгами
 * 
 * Предоставляет методы для получения, создания, обновления и удаления книг,
 * а также управления состоянием загрузки и ошибок.
 */
export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Загрузка списка книг с параметрами
   */
  const loadBooks = useCallback(async (params: BookQueryParameters) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await booksService.getBooks(params)
      
      setBooks(result.books)
      setTotalCount(result.totalCount)
      setTotalPages(result.totalPages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки книг'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Получение книги по ID
   */
  const getBook = useCallback(async (id: string): Promise<Book | null> => {
    try {
      setError(null)
      return await booksService.getBookById(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки книги'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }, [])

  /**
   * Создание новой книги
   */
  const createBook = useCallback(async (bookData: CreateBookRequest): Promise<Book | null> => {
    try {
      setError(null)
      const newBook = await booksService.createBook(bookData)
      toast.success('Книга успешно создана!')
      return newBook
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания книги'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }, [])

  /**
   * Обновление существующей книги
   */
  const updateBook = useCallback(async (id: string, bookData: UpdateBookRequest): Promise<Book | null> => {
    try {
      setError(null)
      const updatedBook = await booksService.updateBook(id, bookData)
      toast.success('Книга успешно обновлена!')
      
      // Обновляем книгу в локальном состоянии
      setBooks(prevBooks => 
        prevBooks.map(book => book.id === id ? updatedBook : book)
      )
      
      return updatedBook
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления книги'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }, [])

  /**
   * Удаление книги
   */
  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const success = await booksService.deleteBook(id)
      
      if (success) {
        toast.success('Книга успешно удалена!')
        
        // Удаляем книгу из локального состояния
        setBooks(prevBooks => prevBooks.filter(book => book.id !== id))
        setTotalCount(prev => prev - 1)
      }
      
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления книги'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
  }, [])

  /**
   * Экспорт книг в CSV
   */
  const exportBooks = useCallback(async (params: BookQueryParameters): Promise<boolean> => {
    try {
      setError(null)
      await booksService.exportToCSV(params)
      toast.success('Экспорт начат! Файл скоро будет скачан.')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка экспорта'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
  }, [])

  /**
   * Очистка ошибок
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Состояние
    books,
    totalCount,
    totalPages,
    isLoading,
    error,
    
    // Методы
    loadBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    exportBooks,
    clearError,
  }
}