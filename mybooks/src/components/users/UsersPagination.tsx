import React from 'react'
import Button from '@/components/ui/Button'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'

interface UsersPaginationProps {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const UsersPagination: React.FC<UsersPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange
}) => {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalCount)
  const pageSizes = [10, 20, 50]

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
      <p className="text-sm">Показано {start}-{end} из {totalCount}</p>
      <div className="flex items-center space-x-2">
        <label>На странице:</label>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {pageSizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onPageChange(1)} disabled={currentPage===1} leftIcon={<ChevronDoubleLeftIcon className="h-4 w-4" />}>First</Button>
        <Button variant="ghost" size="sm" onClick={() => onPageChange(currentPage-1)} disabled={currentPage===1} leftIcon={<ChevronLeftIcon className="h-4 w-4" />}>Prev</Button>
        <span>{currentPage}/{totalPages}</span>
        <Button variant="ghost" size="sm" onClick={() => onPageChange(currentPage+1)} disabled={currentPage===totalPages} rightIcon={<ChevronRightIcon className="h-4 w-4" />}>Next</Button>
        <Button variant="ghost" size="sm" onClick={() => onPageChange(totalPages)} disabled={currentPage===totalPages} rightIcon={<ChevronDoubleRightIcon className="h-4 w-4" />}>Last</Button>
      </div>
    </div>
  )
}

export default UsersPagination