import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUsers } from '@/hooks/useUsers'
import { User, UpdateUserRequest } from '@/types/user'
import UserForm from '../components/users/UserForm'
import Button from '@/components/ui/Button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getUserById, updateUser } = useUsers()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
  if (!id) return
  getUserById(id)
    .then(u => setUser(u))
    .finally(() => setLoading(false))
}, [id, getUserById])

  const handleSubmit = async (data: UpdateUserRequest) => {
    if (!id) return
    setSaving(true)
    await updateUser(id, data)
    navigate(`/admin/users/${id}`)
  }

  if (loading) return <p>Загрузка...</p>
  if (!user) return <p>Пользователь не найден</p>

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeftIcon />}>
        Отмена
      </Button>
      <h1 className="text-2xl font-bold">Редактировать {user.username}</h1>
      <UserForm
        initialData={{
          username: user.username,
          email: user.email,
          role: user.role === 'Admin' ? 2 : user.role === 'User' ? 1 : 0,
          isActive: user.isActive
        }}
        isEditing
        isLoading={saving}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
export default EditUserPage
