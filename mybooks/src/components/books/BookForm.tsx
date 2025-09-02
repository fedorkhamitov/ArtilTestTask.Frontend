import React from 'react'
import { useForm } from 'react-hook-form'
import { CreateBookRequest, UpdateBookRequest } from '@/types/book'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

/**
 * Пропсы компонента BookForm
 */
interface BookFormProps {
  initialData?: Partial<CreateBookRequest>
  onSubmit: (data: CreateBookRequest | UpdateBookRequest) => Promise<void>
  isLoading?: boolean
  isEditing?: boolean
}

/**
 * Универсальная форма для создания и редактирования книг
 * 
 * Предоставляет поля для ввода всех необходимых данных книги
 * с валидацией и обработкой ошибок.
 */
const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateBookRequest>({
    defaultValues: initialData
  })

  /**
   * Текущий год для валидации
   */
  const currentYear = new Date().getFullYear()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Название книги */}
      <div>
        <Input
          label="Название книги *"
          placeholder="Введите название книги"
          error={errors.title?.message}
          {...register('title', {
            required: 'Название книги обязательно',
            maxLength: {
              value: 500,
              message: 'Название не может превышать 500 символов'
            },
            minLength: {
              value: 1,
              message: 'Название не может быть пустым'
            }
          })}
        />
      </div>

      {/* Автор */}
      <div>
        <Input
          label="Автор *"
          placeholder="Введите имя автора"
          error={errors.author?.message}
          {...register('author', {
            required: 'Имя автора обязательно',
            maxLength: {
              value: 200,
              message: 'Имя автора не может превышать 200 символов'
            },
            minLength: {
              value: 1,
              message: 'Имя автора не может быть пустым'
            }
          })}
        />
      </div>

      {/* Жанр и Издательство в одной строке */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Жанр *"
            placeholder="Введите жанр книги"
            error={errors.genre?.message}
            {...register('genre', {
              required: 'Жанр обязателен',
              minLength: {
                value: 1,
                message: 'Жанр не может быть пустым'
              }
            })}
          />
        </div>

        <div>
          <Input
            label="Издательство *"
            placeholder="Введите название издательства"
            error={errors.publishingHouse?.message}
            {...register('publishingHouse', {
              required: 'Издательство обязательно',
              minLength: {
                value: 1,
                message: 'Издательство не может быть пустым'
              }
            })}
          />
        </div>
      </div>

      {/* Год издания и ISBN в одной строке */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Год издания *"
            type="number"
            placeholder="2024"
            min="1000"
            max={currentYear + 1}
            error={errors.year?.message}
            {...register('year', {
              required: 'Год издания обязателен',
              valueAsNumber: true,
              min: {
                value: 1000,
                message: 'Год издания не может быть раньше 1000 года'
              },
              max: {
                value: currentYear + 1,
                message: `Год издания не может быть позже ${currentYear + 1} года`
              }
            })}
          />
        </div>

        <div>
          <Input
            label="ISBN *"
            placeholder="978-5-04-123456-7"
            error={errors.isbn?.message}
            helperText="Формат: ISBN-10 (10 цифр) или ISBN-13 (978/979 + 10 цифр)"
            {...register('isbn', {
              required: 'ISBN обязателен',
              pattern: {
                value: /^(97[89][-\s]?)?[\d\s-]{9,}[\dX]$/i,
                message: 'Неверный формат ISBN. Используйте ISBN-10 или ISBN-13'
              },
              validate: (value) => {
                // Удаляем все не-цифровые символы кроме X
                const cleanISBN = value.replace(/[-\s]/g, '').replace(/x/gi, 'X')
                
                // Проверяем длину
                if (cleanISBN.length === 10) {
                  // ISBN-10 валидация
                  return true // Упрощенная валидация
                } else if (cleanISBN.length === 13) {
                  // ISBN-13 валидация
                  if (cleanISBN.startsWith('978') || cleanISBN.startsWith('979')) {
                    return true // Упрощенная валидация
                  }
                  return 'ISBN-13 должен начинаться с 978 или 979'
                }
                
                return 'ISBN должен содержать 10 или 13 цифр'
              }
            })}
          />
        </div>
      </div>

      {/* Информационные блоки */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Требования к полям:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Название:</strong> до 500 символов</li>
          <li>• <strong>Автор:</strong> до 200 символов</li>
          <li>• <strong>Год:</strong> от 1000 до {currentYear + 1}</li>
          <li>• <strong>ISBN:</strong> формат ISBN-10 или ISBN-13</li>
        </ul>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Отмена
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isEditing ? 'Сохранить изменения' : 'Создать книгу'}
        </Button>
      </div>
    </form>
  )
}

export default BookForm