import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import BookForm from '@/components/books/BookForm'
import { Book, UpdateBookRequest } from '@/types/book'
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getBook, updateBook } = useBooks()

  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!id) {
    return <Navigate to="/books" replace />
  }

  useEffect(() => {
    const loadBook = async () => {
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

  const handleSubmit = async (data: UpdateBookRequest) => {
    if (!book) return
    setIsSubmitting(true)
    try {
      const updatedBook = await updateBook(book.id, data)
      if (updatedBook) {
        navigate(`/books/${updatedBook.id}`)
      }
    } catch (error) {
      console.error('Ошибка обновления книги:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Книга не найдена</h2>
        <p className="mt-2 text-sm text-gray-500">Запрашиваемая книга не существует или была удалена</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/books')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Вернуться к каталогу
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/books/${book.id}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Назад к просмотру</span>
          </button>
          <div className="h-6 border-l border-gray-300"></div>
          <div className="flex items-center space-x-3">
            <PencilIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Редактировать книгу</h1>
              <p className="text-sm text-gray-600">
                "{book.title}" — {book.author}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Информация о книге</h2>
          <p className="mt-1 text-sm text-gray-500">
            Внесите необходимые изменения в информацию о книге
          </p>
        </div>
        <div className="p-6">
          <BookForm
            initialData={{
              title: book.title,
              author: book.author,
              genre: book.genre,
              publishingHouse: book.publishingHouse,
              year: book.year,
              isbn: book.isbn,
            }}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            isEditing={true}
          />
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <PencilIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Внимание при редактировании
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Изменения будут сохранены немедленно после отправки формы</li>
                <li>Убедитесь в правильности введенных данных перед сохранением</li>
                <li>При изменении ISBN убедитесь, что новый номер корректен</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditBookPage