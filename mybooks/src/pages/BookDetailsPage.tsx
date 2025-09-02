import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/hooks/useAuth'
import { Book } from '@/types/book'
import Button from '@/components/ui/Button'
import { 
  BookOpenIcon, 
  PencilIcon, 
  TrashIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

/**
 * Страница детального просмотра книги
 * 
 * Отображает полную информацию о выбранной книге
 * и предоставляет действия для редактирования/удаления.
 */
const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { getBook, deleteBook } = useBooks()
  
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Загрузка данных книги при монтировании компонента
   */
  useEffect(() => {
    const loadBook = async () => {
      if (!id) return
      
      setIsLoading(true)
      try {
        const bookData = await getBook(id)
        setBook(bookData)
      } catch (error) {
        console.error('Ошибка загрузки книги:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBook()
  }, [id, getBook])

  /**
   * Обработка удаления книги
   */
  const handleDelete = async () => {
    if (!book || !window.confirm(`Вы уверены, что хотите удалить книгу "${book.title}"?`)) {
      return
    }

    setIsDeleting(true)
    
    try {
      const success = await deleteBook(book.id)
      if (success) {
        toast.success('Книга успешно удалена')
        navigate('/books')
      }
    } catch (error) {
      console.error('Ошибка удаления книги:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Перенаправление, если ID не указан
  if (!id) {
    return <Navigate to="/books" replace />
  }

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  // Книга не найдена
  if (!book) {
    return (
      <div className="text-center py-12">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Книга не найдена
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Запрашиваемая книга не существует или была удалена
        </p>
        <div className="mt-6">
          <Link to="/books">
            <Button variant="primary" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
              Вернуться к каталогу
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Навигационная панель */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/books">
            <Button 
              variant="ghost" 
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Назад к каталогу
            </Button>
          </Link>
          <div className="h-6 border-l border-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-900">
            Детали книги
          </h1>
        </div>

        {/* Действия */}
        <div className="flex items-center space-x-3">
          {/* Редактирование - для авторизованных пользователей */}
          {isAuthenticated && (
            <Link to={`/books/${book.id}/edit`}>
              <Button 
                variant="outline"
                leftIcon={<PencilIcon className="h-4 w-4" />}
              >
                Редактировать
              </Button>
            </Link>
          )}

          {/* Удаление - только для админов */}
          {user?.role === 'Admin' && (
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<TrashIcon className="h-4 w-4" />}
            >
              Удалить
            </Button>
          )}
        </div>
      </div>

      {/* Основная информация о книге */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {book.title}
              </h2>
              <p className="text-sm text-gray-500">
                ID: {book.id}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Автор */}
            <div className="flex items-start space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Автор
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {book.author}
                </dd>
              </div>
            </div>

            {/* Жанр */}
            <div className="flex items-start space-x-3">
              <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Жанр
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {book.genre}
                  </span>
                </dd>
              </div>
            </div>

            {/* Издательство */}
            <div className="flex items-start space-x-3">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Издательство
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {book.publishingHouse}
                </dd>
              </div>
            </div>

            {/* Год издания */}
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Год издания
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {book.year}
                </dd>
              </div>
            </div>

            {/* ISBN */}
            <div className="md:col-span-2 flex items-start space-x-3">
              <div className="h-5 w-5 mt-0.5 flex items-center justify-center">
                <span className="text-xs font-mono text-gray-400">#</span>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  ISBN
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">
                  {book.isbn}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Информация о книге
        </h3>
        
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>
            Книга <strong>"{book.title}"</strong> авторства <strong>{book.author}</strong> была 
            издана в <strong>{book.year}</strong> году издательством <strong>{book.publishingHouse}</strong>.
          </p>
          
          <p>
            Произведение относится к жанру <strong>{book.genre}</strong> и имеет 
            международный стандартный номер книги (ISBN): <code>{book.isbn}</code>.
          </p>
        </div>
      </div>

      {/* Действия для неавторизованных пользователей */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Хотите внести изменения?
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  Войдите в систему, чтобы редактировать информацию о книгах 
                  и добавлять новые произведения в каталог.
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

export default BookDetailsPage