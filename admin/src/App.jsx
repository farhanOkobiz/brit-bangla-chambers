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
import Blogs from "../pages/blog/Blogs";
import CreateBlog from "../pages/blog/CreateBlog";
import Users from "../pages/Admin/Users";

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
          <Route path="dashboard/blogs" element={<Blogs />} />
          <Route path="dashboard/create-blog" element={<CreateBlog />} />
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
          <Route path="sub-categories" element={<SubcategoryForm />} />
          <Route path="sub-categories" element={<SubcategoryForm />} />
          <Route path="users" element= { <Users/> } />
          {/* Add more child routes here as needed */}
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
