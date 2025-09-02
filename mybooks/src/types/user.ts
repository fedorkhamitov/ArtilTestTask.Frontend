// src/types/user.ts
export interface User {
  id: string
  username: string
  email: string
  role: 'Guest' | 'User' | 'Admin'
  createdAt: string
  isActive: boolean
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: number
  isActive: boolean
}

export interface UpdateUserRequest {
  username: string
  email: string
  role: number
  isActive: boolean
}

export interface PaginationParameters {
  page: number
  pageSize: number
}

export interface UserFilters {
  searchTerm?: string
  username?: string
  email?: string
  role?: number
  isActive?: boolean
  createdFrom?: string
  createdTo?: string
}

export interface UserSorting {
  sortBy?: 'Username' | 'Email' | 'Role' | 'CreatedAt' | 'IsActive'
  direction?: 'Ascending' | 'Descending'
}

export interface UserQueryParameters {
  pagination: PaginationParameters
  filters: UserFilters
  sorting: UserSorting
}

export interface UserQueryResult {
  users: User[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
