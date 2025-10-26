
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { TableProvider } from './contexts/TableContext';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminTablesPage from './pages/AdminTablesPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './components/layout/AppLayout';
import { Role } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactElement; roles: Role[] }> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/m/:qrSlug" element={
        <TableProvider>
          <CartProvider>
            <MenuPage />
          </CartProvider>
        </TableProvider>
      } />
      
      <Route element={<AppLayout />}>
        <Route path="/staff" element={
          <ProtectedRoute roles={[Role.STAFF, Role.ADMIN]}>
            <StaffDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/menu" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <AdminMenuPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/tables" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <AdminTablesPage />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
