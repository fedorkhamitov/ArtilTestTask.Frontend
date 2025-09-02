//import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
//import { useAuth } from "./hooks/useAuth";
import Layout from "./components/ui/Layout";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AddBookPage from "./pages/AddBookPage";
import EditBookPage from "./pages/EditBookPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AuthGuard from "./components/auth/AuthGuard";
import UserDetailsPage from "./pages/UserDetailsPage";
import EditUserPage from "./pages/EditUserPage";

function App() {
  //const { user } = useAuth();

  return (
    <Routes>
      {/* Публичный маршрут */}
      <Route path="/login" element={<LoginPage />} />

      {/* Защищенные */}
      <Route
        element={
          <AuthGuard requiredRoles={[] /* любой авторизованный */}>
            <Layout />
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="books/new" element={<AddBookPage />} />
        <Route path="books/:id/edit" element={<EditBookPage />} />

        {/* Админ */}
        <Route
          path="admin/users"
          element={
            <AuthGuard requiredRoles={["Admin"]}>
              <AdminUsersPage />
            </AuthGuard>
          }
        />
        <Route
          path="admin/users/:id"
          element={
            <AuthGuard requiredRoles={["Admin"]}>
              <UserDetailsPage />
            </AuthGuard>
          }
        />
        <Route
          path="admin/users/:id/edit"
          element={
            <AuthGuard requiredRoles={["Admin"]}>
              <EditUserPage />
            </AuthGuard>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
