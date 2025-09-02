import React from 'react'
import Button from '@/components/ui/Button'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline'

/**
 * Пропсы компонента BooksPagination
 */
interface BooksPaginationProps {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

/**
 * Компонент пагинации для списка книг
 * 
 * Предоставляет навигацию по страницам и выбор размера страницы.
 */
const BooksPagination: React.FC<BooksPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange
}) => {
  /**
   * Генерация массива номеров страниц для отображения
   */
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2 // Количество страниц слева и справа от текущей
    const range: (number | string)[] = []
    
    // Всегда показываем первую страницу
    range.push(1)
    
    if (totalPages <= 7) {
      // Если страниц мало, показываем все
      for (let i = 2; i <= totalPages; i++) {
        range.push(i)
      }
    } else {
      // Сложная логика для большого количества страниц
      if (currentPage <= 3) {
        // Начало списка
        for (let i = 2; i <= 4; i++) {
          range.push(i)
        }
        range.push('...')
        range.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Конец списка
        range.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          if (i > 1) {
            range.push(i)
          }
        }
      } else {
        // Середина списка
        range.push('...')
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          range.push(i)
        }
        range.push('...')
        range.push(totalPages)
      }
    }
    
    return range
  }

  /**
   * Доступные размеры страниц
   */
  const pageSizeOptions = [10, 20, 50, 100]

  /**
   * Вычисление диапазона отображаемых записей
   */
  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalCount)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
      {/* Информация о записях */}
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-700">
          Показано <span className="font-medium">{startRecord}</span> - <span className="font-medium">{endRecord}</span> из{' '}
          <span className="font-medium">{totalCount}</span> записей
        </p>
        
        {/* Выбор размера страницы */}
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            На странице:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Навигация по страницам */}
      <div className="flex items-center space-x-2">
        {/* Переход к первой странице */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          leftIcon={<ChevronDoubleLeftIcon className="h-4 w-4" />}
        >
          Первая
        </Button>

        {/* Предыдущая страница */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
        >
          Назад
        </Button>

        {/* Номера страниц */}
        <div className="hidden sm:flex items-center space-x-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            const isActive = pageNumber === currentPage

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>

        {/* Мобильная версия - только текущая страница */}
        <div className="sm:hidden">
          <span className="px-3 py-2 text-sm font-medium">
            {currentPage} из {totalPages}
          </span>
        </div>

        {/* Следующая страница */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          rightIcon={<ChevronRightIcon className="h-4 w-4" />}
        >
          Далее
        </Button>

        {/* Переход к последней странице */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          rightIcon={<ChevronDoubleRightIcon className="h-4 w-4" />}
        >
          Последняя
        </Button>
      </div>
    </div>
  )
}

export default BooksPagination