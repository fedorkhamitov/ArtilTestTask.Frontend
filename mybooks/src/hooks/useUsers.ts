import { useState, useCallback } from 'react'
import { api } from '@/services/api'
import { ApiResponse } from '@/types/api'
import { 
  User, 
  UserQueryParameters, 
  UserQueryResult, 
} from '@/types/user'
import toast from 'react-hot-toast'
import { UpdateUserRequest } from '@/types/user'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async (params: UserQueryParameters) => {
    setIsLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      // пагинация
      query.append('pagination.page', params.pagination.page.toString())
      query.append('pagination.pageSize', params.pagination.pageSize.toString())
      // фильтры
      Object.entries(params.filters).forEach(([k,v]) => {
        if (v !== undefined && v !== '') {
          query.append(`filters.${k}`, String(v))
        }
      })
      // сортировка
      if (params.sorting.sortBy) {
        query.append('sorting.sortBy', params.sorting.sortBy)
      }
      if (params.sorting.direction) {
        query.append('sorting.direction', params.sorting.direction)
      }
      const response = await api.get<ApiResponse<UserQueryResult>>(
        `/api/users?${query.toString()}`
      )
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message)
      }
      const data = response.data.data
      setUsers(data.users)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    try {
      const resp = await api.get<ApiResponse<User>>(`/api/users/${id}`)
      if (!resp.data.success || !resp.data.data) throw new Error(resp.data.message)
      return resp.data.data
    } catch (e) { toast.error((e as Error).message); return null }
  }, [])

  const updateUser = useCallback(async (id: string, data: UpdateUserRequest): Promise<User | null> => {
    try {
      const resp = await api.put<ApiResponse<User>>(`/api/users/${id}`, data)
      if (!resp.data.success || !resp.data.data) throw new Error(resp.data.message)
      toast.success('Пользователь обновлен')
      return resp.data.data
    } catch (e) { toast.error((e as Error).message); return null }
  }, [])

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      const resp = await api.delete<ApiResponse<boolean>>(`/api/users/${id}`)
      if (!resp.data.success) throw new Error(resp.data.message)
      toast.success('Пользователь удалён')
      return true
    } catch (e) {
      toast.error((e as Error).message)
      return false
    }
  }, [])

  return { users, totalCount, totalPages, isLoading, error, loadUsers, getUserById, updateUser, deleteUser }
}
