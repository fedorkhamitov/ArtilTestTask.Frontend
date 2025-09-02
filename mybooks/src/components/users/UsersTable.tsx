// src/components/users/UsersTable.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserSorting, User } from '@/types/user'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  sorting: UserSorting
  onSortingChange: (sorting: UserSorting) => void
  onDelete: (id: string) => void
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  sorting,
  onSortingChange, 
  onDelete
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSort = (field: UserSorting['sortBy']) => {
    const direction =
      sorting.sortBy === field && sorting.direction === 'Ascending'
        ? 'Descending'
        : 'Ascending'
    onSortingChange({ sortBy: field, direction })
  }

  const SortableHeader: React.FC<{
    field: UserSorting['sortBy']
    label: string
  }> = ({ field, label }) => {
    const isActive = sorting.sortBy === field
    const isAsc = sorting.direction === 'Ascending'
    return (
      <th
        onClick={() => handleSort(field)}
        className="cursor-pointer px-4 py-2 text-left"
      >
        <div className="flex items-center space-x-1">
          <span>{label}</span>
          <div className="flex flex-col">
            <ChevronUpIcon
              className={`h-3 w-3 ${
                isActive && isAsc ? 'text-primary-600' : 'text-gray-300'
              }`}
            />
            <ChevronDownIcon
              className={`h-3 w-3 -mt-1 ${
                isActive && !isAsc ? 'text-primary-600' : 'text-gray-300'
              }`}
            />
          </div>
        </div>
      </th>
    )
  }

  if (isLoading) {
    return <div className="p-4">Загрузка пользователей...</div>
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <SortableHeader field="Username" label="Пользователь" />
          <SortableHeader field="Email" label="Email" />
          <SortableHeader field="Role" label="Роль" />
          <SortableHeader field="CreatedAt" label="Дата регистрации" />
          <SortableHeader field="IsActive" label="Активен" />
          <th className="px-4 py-2 text-right">Действия</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 whitespace-nowrap">{u.username}</td>
            <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
            <td className="px-4 py-2 whitespace-nowrap">{u.role}</td>
            <td className="px-4 py-2 whitespace-nowrap">
              {new Date(u.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-2 whitespace-nowrap">
              {u.isActive ? 'Да' : 'Нет'}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-right space-x-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<EyeIcon className="h-4 w-4" />}
                onClick={() => navigate(`/admin/users/${u.id}`)}
              >
                Просмотр
              </Button>
              {user?.role === 'Admin' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<PencilIcon className="h-4 w-4" />}
                    onClick={() =>
                      navigate(`/admin/users/${u.id}/edit`)
                    }
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<TrashIcon className="h-4 w-4" />}
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(u.id)}
                  >
                    Удалить
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UsersTable