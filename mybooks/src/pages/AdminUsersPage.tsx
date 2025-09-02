// src/pages/AdminUsersPage.tsx
import React, { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { UserQueryParameters, UserFilters, UserSorting } from "@/types/user";
import UsersTable from "../components/users/UsersTable";
import UsersPagination from "../components/users/UsersPagination";
import UsersFilters from "../components/users/UsersFilters";

const AdminUsersPage: React.FC = () => {
  const {
    users,
    totalCount,
    totalPages,
    isLoading,
    error,
    loadUsers,
    deleteUser,
  } = useUsers();

  const [queryParams, setQueryParams] = useState<UserQueryParameters>({
    pagination: { page: 1, pageSize: 20 },
    filters: {},
    sorting: { sortBy: "Username", direction: "Ascending" },
  });

  useEffect(() => {
    loadUsers(queryParams);
  }, [queryParams, loadUsers]);

  const handleFilterChange = (filters: UserFilters) => {
    setQueryParams((q) => ({
      ...q,
      pagination: { ...q.pagination, page: 1 },
      filters,
    }));
  };

  const handleSortingChange = (sorting: UserSorting) => {
    setQueryParams((q) => ({ ...q, sorting }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((q) => ({ ...q, pagination: { ...q.pagination, page } }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams({ ...queryParams, pagination: { page: 1, pageSize } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <UsersFilters
          filters={queryParams.filters}
          onFiltersChange={handleFilterChange}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
      )}

      <div className="bg-white rounded shadow overflow-auto">
        <UsersTable
          users={users}
          isLoading={isLoading}
          sorting={queryParams.sorting}
          onSortingChange={handleSortingChange}
          onDelete={async (id) => {
            if (window.confirm("Удалить пользователя?")) {
              const ok = await deleteUser(id);
              if (ok) loadUsers(queryParams);
            }
          }}
        />
      </div>

      <UsersPagination
        currentPage={queryParams.pagination.page}
        pageSize={queryParams.pagination.pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default AdminUsersPage;
