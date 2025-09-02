import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Book, BookSorting, ColumnVisibility } from '@/types/book'
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

/**
 * Пропсы компонента BooksList
 */
interface BooksListProps {
  books: Book[]
  isLoading: boolean
  sorting: BookSorting
  onSortingChange: (sorting: BookSorting) => void
  columnVisibility: ColumnVisibility
  onDeleteBook?: (id: string) => Promise<void>
}

/**
 * Компонент списка книг в виде таблицы
 * 
 * Отображает книги в табличном формате с возможностью сортировки
 * и управления видимостью колонок.
 */
const BooksList: React.FC<BooksListProps> = ({
  books,
  isLoading,
  sorting,
  onSortingChange,
  columnVisibility,
  onDeleteBook
}) => {
  const { user, isAuthenticated } = useAuth()

  /**
   * Обработка клика по заголовку колонки для сортировки
   */
  const handleSort = (field: BookSorting['sortBy']) => {
    const newDirection = 
      sorting.sortBy === field && sorting.direction === 'Ascending' 
        ? 'Descending' 
        : 'Ascending'
    
    onSortingChange({
      sortBy: field,
      direction: newDirection
    })
  }

  /**
   * Компонент заголовка колонки с сортировкой
   */
  const SortableHeader: React.FC<{
    field: BookSorting['sortBy']
    children: React.ReactNode
    className?: string
  }> = ({ field, children, className }) => {
    const isActive = sorting.sortBy === field
    const isAscending = sorting.direction === 'Ascending'

    return (
      <th
        className={clsx(
          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors',
          className
        )}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          <div className="flex flex-col">
            <ChevronUpIcon 
              className={clsx(
                'h-3 w-3',
                isActive && isAscending ? 'text-primary-600' : 'text-gray-300'
              )} 
            />
            <ChevronDownIcon 
              className={clsx(
                'h-3 w-3 -mt-1',
                isActive && !isAscending ? 'text-primary-600' : 'text-gray-300'
              )} 
            />
          </div>
        </div>
      </th>
    )
  }

  /**
   * Отображение состояния загрузки
   */
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-t-lg"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 border-b border-gray-200"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnVisibility.title && (
                <SortableHeader field="Title">
                  Название
                </SortableHeader>
              )}
              
              {columnVisibility.author && (
                <SortableHeader field="Author">
                  Автор
                </SortableHeader>
              )}
              
              {columnVisibility.genre && (
                <SortableHeader field="Genre">
                  Жанр
                </SortableHeader>
              )}
              
              {columnVisibility.publishingHouse && (
                <SortableHeader field="PublishingHouse">
                  Издательство
                </SortableHeader>
              )}
              
              {columnVisibility.year && (
                <SortableHeader field="Year">
                  Год
                </SortableHeader>
              )}
              
              {columnVisibility.isbn && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
              )}
              
              {/* Колонка действий */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr 
                key={book.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                {columnVisibility.title && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={book.title}>
                      {book.title}
                    </div>
                  </td>
                )}
                
                {columnVisibility.author && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={book.author}>
                      {book.author}
                    </div>
                  </td>
                )}
                
                {columnVisibility.genre && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {book.genre}
                    </span>
                  </td>
                )}
                
                {columnVisibility.publishingHouse && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={book.publishingHouse}>
                      {book.publishingHouse}
                    </div>
                  </td>
                )}
                
                {columnVisibility.year && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {book.year}
                    </div>
                  </td>
                )}
                
                {columnVisibility.isbn && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {book.isbn}
                    </div>
                  </td>
                )}
                
                {/* Действия */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Просмотр - доступно всем */}
                    <Link to={`/books/${book.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<EyeIcon className="h-4 w-4" />}
                      >
                        Просмотр
                      </Button>
                    </Link>
                    
                    {/* Редактирование - только для авторизованных */}
                    {isAuthenticated && (
                      <Link to={`/books/${book.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<PencilIcon className="h-4 w-4" />}
                        >
                          Редактировать
                        </Button>
                      </Link>
                    )}
                    
                    {/* Удаление - только для админов */}
                    {user?.role === 'Admin' && onDeleteBook && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteBook(book.id)}
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Удалить
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {books.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Книги не найдены</p>
        </div>
      )}
    </div>
  )
}

export default BooksList