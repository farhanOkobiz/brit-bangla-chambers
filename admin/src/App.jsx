import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import AdvocateDashboard from '../pages/AdvocateDashboard';
import Unauthorized from '../components/Unauthorized';
import ProtectedRoute from '../auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/advocate/dashboard"
          element={
            <ProtectedRoute requiredRole="advocate">
              <AdvocateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
          <Unauthorized />

          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
