import React from 'react'
import { ColumnVisibility } from '@/types/book'
import Button from '@/components/ui/Button'
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline'

/**
 * Пропсы компонента ColumnToggle
 */
interface ColumnToggleProps {
  visibility: ColumnVisibility
  onChange: (visibility: ColumnVisibility) => void
  onClose: () => void
}

/**
 * Компонент для управления видимостью колонок таблицы
 * 
 * Позволяет пользователю показывать/скрывать колонки в таблице книг.
 */
const ColumnToggle: React.FC<ColumnToggleProps> = ({
  visibility,
  onChange,
  onClose
}) => {
  /**
   * Переключение видимости колонки
   */
  const toggleColumn = (column: keyof ColumnVisibility) => {
    onChange({
      ...visibility,
      [column]: !visibility[column]
    })
  }

  /**
   * Показать все колонки
   */
  const showAll = () => {
    onChange({
      title: true,
      author: true,
      genre: true,
      publishingHouse: true,
      year: true,
      isbn: true
    })
  }

  /**
   * Скрыть необязательные колонки (оставить только основные)
   */
  const showMinimal = () => {
    onChange({
      title: true,
      author: true,
      genre: false,
      publishingHouse: false,
      year: false,
      isbn: false
    })
  }

  /**
   * Метаданные колонок
   */
  const columns = [
    { key: 'title' as const, label: 'Название', required: true },
    { key: 'author' as const, label: 'Автор', required: true },
    { key: 'genre' as const, label: 'Жанр', required: false },
    { key: 'publishingHouse' as const, label: 'Издательство', required: false },
    { key: 'year' as const, label: 'Год издания', required: false },
    { key: 'isbn' as const, label: 'ISBN', required: false }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Настройка колонок
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Быстрые действия */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={showAll}
        >
          Показать все
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={showMinimal}
        >
          Только основные
        </Button>
      </div>

      {/* Список колонок */}
      <div className="space-y-3">
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => !column.required && toggleColumn(column.key)}
                disabled={column.required}
                className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
                  visibility[column.key]
                    ? 'text-primary-600 bg-primary-100'
                    : 'text-gray-400 bg-gray-200'
                } ${column.required ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-primary-200'}`}
              >
                {visibility[column.key] ? (
                  <EyeIcon className="w-3 h-3" />
                ) : (
                  <EyeSlashIcon className="w-3 h-3" />
                )}
              </button>

              <div>
                <span className="text-sm font-medium text-gray-900">
                  {column.label}
                </span>
                {column.required && (
                  <span className="ml-2 text-xs text-gray-500">
                    (обязательная)
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {visibility[column.key] ? 'Видимая' : 'Скрытая'}
            </div>
          </div>
        ))}
      </div>

      {/* Информация */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p>
          💡 <strong>Совет:</strong> Скройте ненужные колонки для более удобного просмотра на мобильных устройствах.
          Настройки сохраняются автоматически.
        </p>
      </div>

      {/* Статистика */}
      <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
        <span>
          Видимых колонок: {Object.values(visibility).filter(Boolean).length} из {columns.length}
        </span>
        <span>
          Обязательных: {columns.filter(c => c.required).length}
        </span>
      </div>
    </div>
  )
}

export default ColumnToggle