import React from 'react'
import { UserFilters } from '@/types/user'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface UsersFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}

const UsersFilters: React.FC<UsersFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleChange = (key: keyof UserFilters, value: string | number | boolean) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clear = () => {
    onFiltersChange({})
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        label="Поиск"
        placeholder="Имя или email"
        value={filters.searchTerm || ''}
        onChange={e => handleChange('searchTerm', e.target.value)}
      />
      <Input
        label="Username"
        placeholder="Username"
        value={filters.username || ''}
        onChange={e => handleChange('username', e.target.value)}
      />
      <Input
        label="Email"
        placeholder="Email"
        value={filters.email || ''}
        onChange={e => handleChange('email', e.target.value)}
      />
      <div className="flex items-end space-x-2">
        <Button variant="outline" onClick={clear} leftIcon={<XMarkIcon className="h-5 w-5" />}>
          Сбросить
        </Button>
      </div>
    </div>
  )
}

export default UsersFilters