import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUsers } from '@/hooks/useUsers'
import Button from '@/components/ui/Button'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import { User } from '@/types/user'

const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getUserById } = useUsers() // добавьте метод getUserById в хук
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!id) return
  getUserById(id)
    .then(u => setUser(u))
    .finally(() => setLoading(false))
    }, [id, getUserById])

  if (loading) return <p>Загрузка...</p>
  if (!user) return <p>Пользователь не найден</p>

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeftIcon />}>
        Назад
      </Button>
      <h1 className="text-2xl font-bold">{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
      <p>Активен: {user.isActive ? 'Да' : 'Нет'}</p>
      <p>Зарегистрирован: {new Date(user.createdAt).toLocaleString()}</p>
      <Button
        variant="primary"
        leftIcon={<PencilIcon />}
        onClick={() => navigate(`/admin/users/${id}/edit`)}
      >
        Редактировать
      </Button>
    </div>
  )
}
export default UserDetailsPage