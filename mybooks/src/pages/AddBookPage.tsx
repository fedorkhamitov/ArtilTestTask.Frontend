import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import BookForm from '@/components/books/BookForm'
import { CreateBookRequest } from '@/types/book'
import { PlusIcon, ArrowLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline'

/**
 * Страница добавления новой книги
 * 
 * Предоставляет форму для создания новой книги в каталоге.
 * Доступна только авторизованным пользователям.
 */
const AddBookPage: React.FC = () => {
  const navigate = useNavigate()
  const { createBook } = useBooks()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  /**
   * Обработка отправки формы создания книги
   */
  const handleSubmit = async (data: CreateBookRequest) => {
    setIsSubmitting(true)
    
    try {
      const newBook = await createBook(data)
      if (newBook) {
        // Перенаправляем на страницу просмотра созданной книги
        navigate(`/books/${newBook.id}`)
      }
    } catch (error) {
      console.error('Ошибка создания книги:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/books')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Назад к каталогу</span>
          </button>
          <div className="h-6 border-l border-gray-300"></div>
          <div className="flex items-center space-x-3">
            <PlusIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Добавить новую книгу
              </h1>
              <p className="text-sm text-gray-600">
                Заполните информацию о книге для добавления в каталог
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Основная форма */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Информация о книге
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Все поля, отмеченные звездочкой (*), обязательны для заполнения
          </p>
        </div>

        <div className="p-6">
          <BookForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            isEditing={false}
          />
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <BookOpenIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Рекомендации по заполнению
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Название:</strong> Указывайте полное официальное название без сокращений
                </li>
                <li>
                  <strong>Автор:</strong> Используйте формат "Имя Фамилия" или "Фамилия, Имя"
                </li>
                <li>
                  <strong>Жанр:</strong> Выберите наиболее подходящий основной жанр произведения
                </li>
                <li>
                  <strong>ISBN:</strong> Найдите ISBN на обложке или странице с выходными данными
                </li>
                <li>
                  <strong>Год:</strong> Указывайте год первого издания или год конкретного издания
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Примеры правильного заполнения */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Примеры правильного заполнения:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Художественная литература:</h4>
            <ul className="space-y-1 text-gray-600">
              <li><strong>Название:</strong> Война и мир</li>
              <li><strong>Автор:</strong> Лев Николаевич Толстой</li>
              <li><strong>Жанр:</strong> Классическая литература</li>
              <li><strong>Издательство:</strong> Эксмо</li>
              <li><strong>Год:</strong> 1869</li>
              <li><strong>ISBN:</strong> 978-5-04-123456-7</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Техническая литература:</h4>
            <ul className="space-y-1 text-gray-600">
              <li><strong>Название:</strong> Чистый код</li>
              <li><strong>Автор:</strong> Роберт Мартин</li>
              <li><strong>Жанр:</strong> Программирование</li>
              <li><strong>Издательство:</strong> Питер</li>
              <li><strong>Год:</strong> 2018</li>
              <li><strong>ISBN:</strong> 978-5-496-02389-5</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Полезные ссылки */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Затрудняетесь с заполнением? Проверьте информацию на{' '}
          <a 
            href="https://www.worldcat.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            WorldCat
          </a>
          {' '}или{' '}
          <a 
            href="https://openlibrary.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Open Library
          </a>
        </p>
      </div>
    </div>
  )
}

export default AddBookPage