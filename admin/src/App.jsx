import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminPanel from "../pages/AdminPanel";
import AdvocatePanel from "../pages/AdvocatePanel";
import Unauthorized from "../components/Unauthorized";
import ProtectedRoute from "../auth/ProtectedRoute";
import CategoryForm from "../components/CategoryForm";
import SubcategoryForm from "../components/subCategoryForm";
import AdminDashboard from "../components/AdminDashboard";
import AdvocateDashboard from "../components/AdvocateDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />


        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/advocate"
          element={
            <ProtectedRoute requiredRole="advocate">
              <AdvocatePanel />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdvocateDashboard />} />
          {/* Add more advocate child routes here as needed */}
        </Route>

        {/* Fallback Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryForm />} />
          <Route path="sub-categories" element={<SubcategoryForm />} />
          {/* Add more child routes here as needed */}
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
