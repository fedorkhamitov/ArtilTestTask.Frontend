import React, { useState, useEffect } from 'react'
import { BookFilters } from '@/types/book'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { booksService } from '@/services/booksService'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

/**
 * Пропсы компонента BookFilters
 */
interface BookFiltersProps {
  filters: BookFilters
  onFiltersChange: (filters: BookFilters) => void
  onClearFilters: () => void
}

/**
 * Компонент фильтров для поиска книг
 * 
 * Предоставляет поля для фильтрации книг по различным критериям:
 * поиск, автор, жанр, издательство, год издания.
 */
const BookFiltersComponent: React.FC<BookFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState<BookFilters>(filters)
  const [genres, setGenres] = useState<string[]>([])
  const [isLoadingGenres, setIsLoadingGenres] = useState(false)

  /**
   * Загрузка списка жанров при монтировании компонента
   */
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoadingGenres(true)
        const genresList = await booksService.getGenres()
        setGenres(genresList)
      } catch (error) {
        console.error('Ошибка загрузки жанров:', error)
      } finally {
        setIsLoadingGenres(false)
      }
    }

    loadGenres()
  }, [])

  /**
   * Синхронизация локальных фильтров с внешними
   */
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  /**
   * Обработка изменения значения фильтра
   */
  const handleFilterChange = (key: keyof BookFilters, value: string | number | undefined) => {
    const newFilters = {
      ...localFilters,
      [key]: value || undefined
    }
    
    // Удаляем пустые значения
    Object.keys(newFilters).forEach(k => {
      const filterKey = k as keyof BookFilters
      if (!newFilters[filterKey]) {
        delete newFilters[filterKey]
      }
    })
    
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  /**
   * Очистка всех фильтров
   */
  const handleClearAll = () => {
    setLocalFilters({})
    onClearFilters()
  }

  /**
   * Проверка наличия активных фильтров
   */
  const hasActiveFilters = Object.keys(localFilters).length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Поиск и фильтры
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            leftIcon={<XMarkIcon className="h-4 w-4" />}
          >
            Очистить все
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Общий поиск */}
        <div className="md:col-span-2 lg:col-span-3">
          <Input
            label="Поиск по всем полям"
            placeholder="Введите название, автора, издательство или ISBN..."
            value={localFilters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>

        {/* Автор */}
        <div>
          <Input
            label="Автор"
            placeholder="Поиск по автору..."
            value={localFilters.author || ''}
            onChange={(e) => handleFilterChange('author', e.target.value)}
          />
        </div>

        {/* Жанр */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Жанр
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={localFilters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            disabled={isLoadingGenres}
          >
            <option value="">Все жанры</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Издательство */}
        <div>
          <Input
            label="Издательство"
            placeholder="Поиск по издательству..."
            value={localFilters.publishingHouse || ''}
            onChange={(e) => handleFilterChange('publishingHouse', e.target.value)}
          />
        </div>

        {/* Год издания (от) */}
        <div>
          <Input
            label="Год издания (от)"
            type="number"
            placeholder="1900"
            min="1000"
            max={new Date().getFullYear() + 1}
            value={localFilters.yearFrom || ''}
            onChange={(e) => handleFilterChange('yearFrom', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        {/* Год издания (до) */}
        <div>
          <Input
            label="Год издания (до)"
            type="number"
            placeholder={new Date().getFullYear().toString()}
            min="1000"
            max={new Date().getFullYear() + 1}
            value={localFilters.yearTo || ''}
            onChange={(e) => handleFilterChange('yearTo', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Информация об активных фильтрах */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500">Активные фильтры:</span>
          
          {localFilters.searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Поиск: "{localFilters.searchTerm}"
              <button
                onClick={() => handleFilterChange('searchTerm', undefined)}
                className="ml-1 text-primary-600 hover:text-primary-800"
              >
                ✕
              </button>
            </span>
          )}
          
          {localFilters.author && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Автор: {localFilters.author}
              <button
                onClick={() => handleFilterChange('author', undefined)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </span>
          )}
          
          {localFilters.genre && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Жанр: {localFilters.genre}
              <button
                onClick={() => handleFilterChange('genre', undefined)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </span>
          )}
          
          {localFilters.publishingHouse && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Издательство: {localFilters.publishingHouse}
              <button
                onClick={() => handleFilterChange('publishingHouse', undefined)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ✕
              </button>
            </span>
          )}
          
          {(localFilters.yearFrom || localFilters.yearTo) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Год: {localFilters.yearFrom || '∞'} - {localFilters.yearTo || '∞'}
              <button
                onClick={() => {
                  handleFilterChange('yearFrom', undefined)
                  handleFilterChange('yearTo', undefined)
                }}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default BookFiltersComponent