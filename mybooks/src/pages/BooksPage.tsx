import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBooks } from '@/hooks/useBooks'
import BooksList from '@/components/books/BooksList'
import BookFiltersComponent from '@/components/books/BookFilters'
import BooksPagination from '@/components/books/BooksPagination'
import ColumnToggle from '@/components/books/ColumnToggle'
import Button from '@/components/ui/Button'
import { BookQueryParameters, BookFilters, BookSorting, ColumnVisibility } from '@/types/book'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

/**
 * Главная страница со списком книг
 * 
 * Отображает список книг с возможностями фильтрации, поиска, сортировки,
 * пагинации и управления видимостью колонок.
 */
const BooksPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const { 
    books, 
    totalCount, 
    totalPages, 
    isLoading, 
    error, 
    loadBooks, 
    exportBooks,
    clearError 
  } = useBooks()

  // Состояние параметров запроса
  const [queryParams, setQueryParams] = useState<BookQueryParameters>({
    pagination: { page: 1, pageSize: 20 },
    filters: {},
    sorting: { sortBy: 'Title', direction: 'Ascending' }
  })

  // Состояние видимости колонок (сохраняется в localStorage)
  const [columnVisibility, setColumnVisibility] = useLocalStorage<ColumnVisibility>(
    'books_column_visibility',
    {
      title: true,
      author: true,
      genre: true,
      publishingHouse: true,
      year: true,
      isbn: false
    }
  )

  // Состояние для показа настроек колонок
  const [showColumnSettings, setShowColumnSettings] = useState(false)

  /**
   * Загружаем книги при изменении параметров запроса
   */
  useEffect(() => {
    loadBooks(queryParams)
  }, [queryParams, loadBooks])

  /**
   * Обработка изменения фильтров
   */
  const handleFiltersChange = (filters: BookFilters) => {
    setQueryParams(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page: 1 }, // Сбрасываем на первую страницу
      filters
    }))
  }

  /**
   * Обработка изменения сортировки
   */
  const handleSortingChange = (sorting: BookSorting) => {
    setQueryParams(prev => ({
      ...prev,
      sorting
    }))
  }

  /**
   * Обработка изменения страницы
   */
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page }
    }))
  }

  /**
   * Обработка изменения размера страницы
   */
  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      pagination: { page: 1, pageSize }
    }))
  }

  /**
   * Обработка экспорта в CSV
   */
  const handleExport = async () => {
    await exportBooks(queryParams)
  }

  /**
   * Очистка всех фильтров
   */
  const handleClearFilters = () => {
    setQueryParams(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page: 1 },
      filters: {}
    }))
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpenIcon className="h-8 w-8 mr-3 text-primary-600" />
            Библиотека
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {totalCount > 0 ? (
              <>Найдено {totalCount} {totalCount === 1 ? 'книга' : totalCount < 5 ? 'книги' : 'книг'}</>
            ) : (
              'Управление каталогом книг'
            )}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* Настройки колонок */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            leftIcon={<Cog6ToothIcon className="h-4 w-4" />}
          >
            Колонки
          </Button>

          {/* Экспорт CSV - только для авторизованных */}
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
            >
              Экспорт CSV
            </Button>
          )}

          {/* Добавить книгу - только для авторизованных */}
          {isAuthenticated && (
            <Link to="/books/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                Добавить книгу
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Настройки видимости колонок */}
      {showColumnSettings && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <ColumnToggle
            visibility={columnVisibility}
            onChange={setColumnVisibility}
            onClose={() => setShowColumnSettings(false)}
          />
        </div>
      )}

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-lg shadow">
        <BookFiltersComponent
          filters={queryParams.filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Основной контент */}
      <div className="bg-white shadow rounded-lg">
        {error && (
          <div className="p-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                <span className="sr-only">Закрыть</span>
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Список книг */}
        <BooksList
          books={books}
          isLoading={isLoading}
          sorting={queryParams.sorting}
          onSortingChange={handleSortingChange}
          columnVisibility={columnVisibility}
        />

        {/* Пагинация */}
        {totalCount > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <BooksPagination
              currentPage={queryParams.pagination.page}
              pageSize={queryParams.pagination.pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}

        {/* Состояние "нет данных" */}
        {!isLoading && books.length === 0 && !error && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              Книги не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(queryParams.filters).length > 0
                ? 'Попробуйте изменить параметры поиска'
                : 'В библиотеке пока нет книг'
              }
            </p>
            {Object.keys(queryParams.filters).length > 0 && (
              <div className="mt-6">
                <Button variant="outline" onClick={handleClearFilters}>
                  Очистить фильтры
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Информация для гостей */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Режим просмотра
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  Вы просматриваете библиотеку в режиме гостя. 
                  Для добавления книг и экспорта данных необходимо войти в систему.
                </p>
              </div>
              <div className="mt-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Войти в систему
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BooksPage