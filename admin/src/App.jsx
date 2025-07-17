import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import AdvocateDashboard from "../pages/AdvocateDashboard";
import Unauthorized from "../components/Unauthorized";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../pages/Dashboard"; // Make sure this is the layout with <Outlet />
import CategoryForm from "../components/CategoryForm";
import SubcategoryForm from "../components/subCategoryForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

       
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="categories" element={<CategoryForm />} />
        
        </Route>

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="sub-categories" element={<SubcategoryForm />} />
        
        </Route>

        
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

        {/* Fallback Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
