import React from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserRequest, UpdateUserRequest } from '@/types/user'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface UserFormProps {
  initialData?: Partial<UpdateUserRequest>
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>
  isLoading?: boolean
  isEditing?: boolean
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, isLoading, isEditing }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserRequest>({
    defaultValues: initialData
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Username"
        error={errors.username?.message}
        {...register('username', { required: 'Username обязателен' })}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email', { required: 'Email обязателен' })}
      />
      <div>
        <label>Роль</label>
        <select {...register('role', { valueAsNumber: true })} className="block w-full">
          <option value={0}>Guest</option>
          <option value={1}>User</option>
          <option value={2}>Admin</option>
        </select>
      </div>
      <div>
        <label>Активен</label>
        <input type="checkbox" {...register('isActive')} />
      </div>
      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        {isEditing ? 'Сохранить' : 'Создать'}
      </Button>
    </form>
  )
}
export default UserForm
